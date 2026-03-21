"use server";

export interface InstallmentOption {
    installments: number;
    installment_rate: number;
    discount_rate: number;
    reimbursement_rate: number | null;
    labels: string[];
    installment_amount_formatted: string;
    total_amount_formatted: string;
    // Campos brutos para cálculo
    installment_amount: number;
    total_amount: number;
}

// Helper de formatação
const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

// Helper para gerar parcelas matematicamente (Fallback com simulação de juros)
function generateFallbackOptions(
    amount: number,
    maxInstallments: number,
    freeInstallments: number
): InstallmentOption[] {
    const options: InstallmentOption[] = [];
    // Limita o fallback a 12x ou o máximo configurado, o que for menor
    const limit = Math.min(maxInstallments || 12, 12);

    for (let i = 1; i <= limit; i++) {
        let rate = 0;
        let total = amount;

        // Se a parcela atual for maior que o limite "sem juros", aplica simulação
        if (i > freeInstallments) {
            // Simula uma taxa de mercado (aprox. 1.99% a.m) para não parecer "Grátis"
            // Isso garante que o UI mostre que tem juros
            rate = 1.99;
            total = amount * Math.pow(1.0199, i);
        }

        const installmentValue = total / i;

        options.push({
            installments: i,
            installment_rate: rate,
            discount_rate: 0,
            reimbursement_rate: null,
            labels: [],
            installment_amount: installmentValue,
            total_amount: total,
            installment_amount_formatted: formatMoney(installmentValue),
            total_amount_formatted: formatMoney(total)
        });
    }
    return options;
}

export async function getInstallmentOptions(
    amount: number,
    maxInstallments: number = 12,
    freeInstallments: number = 0
): Promise<InstallmentOption[]> {
    if (!amount || amount <= 0) return [];

    // 1. Verificação GRACIOSA: Se não tem chaves, usa fallback silenciosamente
    if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || !process.env.MP_ACCESS_TOKEN) {
        console.warn("⚠️ [Payment] Credenciais do Mercado Pago ausentes. Usando simulação local.");
        return generateFallbackOptions(amount, maxInstallments, freeInstallments);
    }

    try {
        // 2. Busca as parcelas padrão do Mercado Pago
        const response = await fetch(`https://api.mercadopago.com/v1/payment_methods/installments?public_key=${process.env.NEXT_PUBLIC_MP_PUBLIC_KEY}&amount=${amount}&bin=530444`, {
            headers: {
                'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
            },
            next: { revalidate: 3600 } // Cache de 1 hora
        });

        if (!response.ok) {
            throw new Error(`Status ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data[0] || !data[0].payer_costs) {
            throw new Error("Resposta vazia ou inválida do MP");
        }

        let options: any[] = data[0].payer_costs;

        // 3. Filtrar pelo MÁXIMO de parcelas configurado no produto
        options = options.filter(opt => opt.installments <= maxInstallments);

        // 4. Processar regra "Sem Juros"
        const processedOptions = options.map(opt => {
            const isFreeRule = opt.installments <= freeInstallments;

            if (isFreeRule) {
                // Loja assume os juros (Simulação Local Sem Juros)
                const rawAmount = amount / opt.installments;
                return {
                    installments: opt.installments,
                    installment_rate: 0,
                    discount_rate: 0,
                    reimbursement_rate: null,
                    labels: [...(opt.labels || []), 'interest_free_configured'],
                    installment_amount: rawAmount,
                    total_amount: amount,
                    installment_amount_formatted: formatMoney(rawAmount),
                    total_amount_formatted: formatMoney(amount)
                };
            } else {
                // Mantém juros reais do MP
                return {
                    installments: opt.installments,
                    installment_rate: opt.installment_rate,
                    discount_rate: opt.discount_rate,
                    reimbursement_rate: opt.reimbursement_rate,
                    labels: opt.labels,
                    installment_amount: opt.installment_amount,
                    total_amount: opt.total_amount,
                    installment_amount_formatted: formatMoney(opt.installment_amount),
                    total_amount_formatted: formatMoney(opt.total_amount)
                };
            }
        });

        return processedOptions;

    } catch (error) {
        console.error("⚠️ [Payment] Erro na API do Mercado Pago (usando fallback):", error);
        // Em caso de erro, usa a simulação local respeitando as regras configuradas
        return generateFallbackOptions(amount, maxInstallments, freeInstallments);
    }
}
