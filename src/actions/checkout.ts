"use server";

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

interface CheckoutItem {
    id: number;
    quantity: number;
}

interface CustomerData {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    cep: string;
    addressStreet: string;
    addressNumber: string;
    addressNeighborhood: string;
    addressCity?: string;
    addressState?: string;
    addressComplement?: string;
}

export async function createCheckout(
    cartItems: CheckoutItem[],
    customer: CustomerData,
    couponCode?: string
) {
    try {
        const cookieStore = await cookies();
        const userIdCookie = cookieStore.get("sanches_session");
        const userId = userIdCookie ? Number(userIdCookie.value) : null;

        // Monta endereço
        let addressText = `${customer.addressStreet}, ${customer.addressNumber}`;
        if (customer.addressNeighborhood) addressText += ` - ${customer.addressNeighborhood}`;
        if (customer.addressCity) addressText += ` - ${customer.addressCity}`;
        if (customer.addressState) addressText += `/${customer.addressState}`;

        // 1. Busca produtos (Convertendo IDs para garantir number)
        const productIds = cartItems.map(item => Number(item.id));
        const productsDb = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { category: true } // Traz categoria completa
        });

        // Valida estoque e existência
        for (const item of cartItems) {
            const product = productsDb.find(p => p.id === Number(item.id));
            if (!product || !product.isActive) {
                return { error: `Produto #${item.id} indisponível.` };
            }
            if (product.stock < item.quantity) {
                return { error: `Estoque insuficiente para ${product.name}.` };
            }
        }

        // 2. Calcula Totais Base
        let totalAmount = 0;
        const mpItems = [];
        const orderItemsData = [];

        // Define limite de parcelas
        let cartMaxInstallments = 12;
        if (productsDb.length > 0) {
            const minOfProducts = Math.min(...productsDb.map(p => p.maxInstallments));
            cartMaxInstallments = Math.max(1, minOfProducts);
        }

        for (const item of cartItems) {
            const product = productsDb.find(p => p.id === Number(item.id))!;
            // Preço com desconto do produto (promoção individual)
            const unitPrice = Number(product.price) * (1 - product.discountPercent / 100);

            totalAmount += unitPrice * item.quantity;

            mpItems.push({
                id: String(product.id),
                title: product.name,
                quantity: item.quantity,
                unit_price: Number(unitPrice.toFixed(2)),
                currency_id: 'BRL'
            });

            orderItemsData.push({
                productId: product.id,
                name: product.name,
                quantity: item.quantity,
                price: unitPrice
            });
        }

        // 3. Aplica Cupom com VALIDAÇÃO RIGOROSA
        if (couponCode) {
            const normalizedCouponCode = couponCode.trim().toUpperCase();
            const coupon = await prisma.coupon.findFirst({
                where: {
                    code: normalizedCouponCode,
                    isActive: true
                },
                include: { category: true }
            });

            if (coupon) {
                // Validações básicas
                const now = new Date();
                if (coupon.expiresAt && now > coupon.expiresAt) return { error: "Cupom expirado." };
                if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { error: "Cupom esgotado." };
                if (coupon.minOrderValue && totalAmount < Number(coupon.minOrderValue)) {
                    return { error: `Valor mínimo: R$ ${Number(coupon.minOrderValue)}` };
                }

                // --- LÓGICA DE CATEGORIA ---
                if (coupon.categoryId) {
                    // Verifica se TEM algum item da categoria
                    const eligibleProducts = productsDb.filter(p => p.categoryId === coupon.categoryId);

                    if (eligibleProducts.length === 0) {
                        return { error: `Este cupom é exclusivo para: ${coupon.category?.name}` };
                    }
                }

                // --- CÁLCULO DO DESCONTO ---
                let discountVal = 0;

                if (coupon.discountType === 'PERCENT') {
                    if (coupon.categoryId) {
                        // Calcula total APENAS dos itens da categoria correta
                        const eligibleTotal = cartItems.reduce((acc, item) => {
                            const product = productsDb.find(p => p.id === Number(item.id));
                            if (product && product.categoryId === coupon.categoryId) {
                                const price = Number(product.price) * (1 - product.discountPercent / 100);
                                return acc + (price * item.quantity);
                            }
                            return acc;
                        }, 0);

                        discountVal = eligibleTotal * (Number(coupon.discountValue) / 100);
                    } else {
                        // Sem restrição: aplica no total geral
                        discountVal = totalAmount * (Number(coupon.discountValue) / 100);
                    }
                } else {
                    // Desconto FIXO
                    discountVal = Number(coupon.discountValue);
                }

                // Aplica
                if (discountVal > 0) {
                    // Trava de segurança: desconto não pode ser maior que o total
                    if (discountVal >= totalAmount) discountVal = totalAmount - 1; // Deixa R$ 1 simbólico ou zera

                    totalAmount -= discountVal;

                    // Adiciona item negativo no MP
                    mpItems.push({
                        id: 'cupom',
                        title: `Desconto (${normalizedCouponCode})`,
                        quantity: 1,
                        unit_price: -Number(discountVal.toFixed(2)),
                        currency_id: 'BRL'
                    });

                    // Incrementa uso
                    await prisma.coupon.update({
                        where: { id: coupon.id },
                        data: { usedCount: { increment: 1 } }
                    });
                }
            } else {
                return { error: "Cupom inválido." };
            }
        }

        // 4. Cria Pedido
        const order = await prisma.order.create({
            data: {
                total: totalAmount,
                status: 'PENDING',
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                customerDoc: customer.cpf,
                shippingAddress: addressText,
                shippingCep: customer.cep,
                userId: userId,
                items: {
                    create: orderItemsData.map(i => ({
                        productId: i.productId,
                        name: i.name,
                        quantity: i.quantity,
                        price: i.price
                    }))
                }
            }
        });

        // 5. URLs
        let baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        baseUrl = baseUrl.trim().replace(/\/$/, "");
        if (!baseUrl.startsWith('http')) baseUrl = `http://${baseUrl}`;

        const backUrls = {
            success: `${baseUrl}/sucesso?orderId=${order.id}`,
            failure: `${baseUrl}/checkout?error=true`,
            pending: `${baseUrl}/checkout?pending=true`,
        };

        // 6. Preferência MP
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: mpItems,
                payer: {
                    email: customer.email,
                    name: customer.name,
                },
                payment_methods: {
                    installments: cartMaxInstallments,
                },
                back_urls: backUrls,
                external_reference: order.id,
                statement_descriptor: "SANCHES MOVEIS",
            }
        });

        if (response.init_point) {
            return { url: response.init_point };
        } else {
            return { error: "Erro na comunicação com Mercado Pago" };
        }

    } catch (error: any) {
        console.error("❌ Erro checkout:", error);
        return { error: "Erro interno ao processar pedido." };
    }
}
