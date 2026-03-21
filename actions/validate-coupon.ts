"use server";

import { prisma } from "@/lib/prisma";

// NOVA ASSINATURA: Recebe lista de itens {id, quantity}
export async function validateCoupon(code: string, items: { id: number; quantity: number }[]) {
    if (!code || code.trim() === "") return { error: "Digite um código." };
    if (!items || items.length === 0) return { error: "Carrinho vazio." };

    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
            include: { category: true }
        });

        if (!coupon) return { error: "Cupom não encontrado." };
        if (!coupon.isActive) return { error: "Cupom inativo." };
        if (coupon.expiresAt && new Date() > coupon.expiresAt) return { error: "Cupom expirado." };
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { error: "Cupom esgotado." };

        // 1. Busca produtos para validar regras
        const productIds = items.map(i => Number(i.id));
        const productsDb = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price: true, discountPercent: true, categoryId: true }
        });

        // 2. Calcula Subtotal Real
        let cartTotal = 0;
        items.forEach(item => {
            const prod = productsDb.find(p => p.id === Number(item.id));
            if (prod) {
                const price = Number(prod.price) * (1 - prod.discountPercent / 100);
                cartTotal += price * item.quantity;
            }
        });

        // 3. Valida Valor Mínimo
        if (coupon.minOrderValue && cartTotal < Number(coupon.minOrderValue)) {
            return { error: `Compra mínima: R$ ${Number(coupon.minOrderValue).toFixed(2)}` };
        }

        // 4. Valida Categoria (O PULO DO GATO)
        let discountValue = 0;

        if (coupon.categoryId) {
            // Verifica se tem produtos dessa categoria
            const eligibleProducts = productsDb.filter(p => p.categoryId === coupon.categoryId);

            if (eligibleProducts.length === 0) {
                return { error: `Válido apenas para: ${coupon.category?.name}` };
            }

            // Se for PORCENTAGEM, calcula só sobre os elegíveis
            if (coupon.discountType === 'PERCENT') {
                const eligibleTotal = items.reduce((acc, item) => {
                    const prod = productsDb.find(p => p.id === Number(item.id));
                    if (prod && prod.categoryId === coupon.categoryId) {
                        const price = Number(prod.price) * (1 - prod.discountPercent / 100);
                        return acc + (price * item.quantity);
                    }
                    return acc;
                }, 0);

                discountValue = eligibleTotal * (Number(coupon.discountValue) / 100);
            } else {
                // Se for FIXO, aplica normal (assumindo que cumpriu o requisito de ter o item)
                discountValue = Number(coupon.discountValue);
            }
        } else {
            // Cupom global
            if (coupon.discountType === 'PERCENT') {
                discountValue = cartTotal * (Number(coupon.discountValue) / 100);
            } else {
                discountValue = Number(coupon.discountValue);
            }
        }

        // Trava final
        discountValue = Math.min(discountValue, cartTotal);

        const msg = coupon.discountType === 'FIXED'
            ? `Desconto de R$ ${discountValue.toFixed(2)} aplicado!`
            : `Desconto de ${Number(coupon.discountValue)}% aplicado!`;

        return {
            success: true,
            code: coupon.code,
            amount: discountValue, // Retorna o valor JÁ CALCULADO em Reais
            type: 'FIXED',         // Front trata como valor fixo final para simplificar
            message: msg
        };

    } catch (error) {
        console.error("Erro validar cupom:", error);
        return { error: "Erro interno ao validar cupom." };
    }
}