import { deleteCouponFormAction } from "@/actions/coupons";
import { prisma } from "@/lib/prisma";
import { Trash2, Plus, Edit, Calendar, Users, Layers, Sparkles, Copy, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
    // 1. Busca os dados
    const couponsData = await prisma.coupon.findMany({
        orderBy: [
            { isActive: 'desc' },
            { createdAt: 'desc' }
        ],
        include: { category: true }
    });

    // 2. CORREÇÃO TÉCNICA: Serializar e Mapear campos do Banco para o Design
    // Aqui conectamos os nomes novos do banco (discountValue) com o design antigo (discount)
    const coupons = couponsData.map(coupon => ({
        ...coupon,
        // Banco: discountValue -> Design: discount
        discount: Number(coupon.discountValue),

        // Banco: minOrderValue -> Design: minPurchase
        minPurchase: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,

        // Banco: usageLimit -> Design: maxUses
        maxUses: coupon.usageLimit,

        // Banco: discountType -> Design: type
        type: coupon.discountType
    }));

    return (
        <div className="min-h-screen pb-20">
            {/* --- HEADER COM EFEITO --- */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Cupons & Ofertas <Sparkles className="h-8 w-8 text-yellow-500 fill-yellow-500 animate-pulse" />
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Gerencie suas campanhas com estilo e precisão.</p>
                </div>

                <Link
                    href="/admin/cupons/novo"
                    className="group bg-neutral-900 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1 flex items-center gap-3 font-bold"
                >
                    <div className="bg-yellow-500 text-black rounded-full p-1 group-hover:rotate-90 transition-transform">
                        <Plus className="h-4 w-4" />
                    </div>
                    Criar Novo Cupom
                </Link>
            </div>

            {/* --- GRID DE TICKETS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {coupons.map((coupon) => {
                    const isExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt);
                    const isDepleted = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
                    const isValid = coupon.isActive && !isExpired && !isDepleted;

                    // Definição de Estilo baseado no status (Design Original)
                    const cardTheme = isValid
                        ? "bg-neutral-900 text-white shadow-2xl shadow-neutral-200 border-neutral-800"
                        : "bg-white text-gray-400 border-gray-200 opacity-80 grayscale";

                    const accentColor = isValid ? "text-yellow-400" : "text-gray-400";
                    const badgeColor = isValid ? "bg-yellow-500 text-black" : "bg-gray-200 text-gray-500";

                    // Cálculo da porcentagem de uso
                    const usagePercent = coupon.maxUses
                        ? Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)
                        : 0;

                    return (
                        <div key={coupon.id} className="relative group perspective">
                            {/* Efeito de Glow no Hover (apenas ativos) */}
                            {isValid && (
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-75 blur transition duration-500"></div>
                            )}

                            {/* --- O CARTÃO TICKET --- */}
                            <div className={`relative ${cardTheme} rounded-2xl border overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1`}>

                                {/* Recortes do Ticket (Circles) */}
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-100 z-10"></div>
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-100 z-10"></div>
                                <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-white/10 pointer-events-none"></div>

                                {/* Parte Superior: O Desconto */}
                                <div className="p-6 pb-8 text-center relative overflow-hidden">
                                    {/* Background Pattern Sutil */}
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${badgeColor}`}>
                                        {isValid ? 'Ativo' : isExpired ? 'Expirado' : isDepleted ? 'Esgotado' : 'Inativo'}
                                    </div>

                                    <div className={`text-5xl font-black tracking-tighter ${accentColor}`}>
                                        {coupon.type === 'PERCENT' ? (
                                            <span>{coupon.discount}%<small className="text-lg text-white/50 ml-1">OFF</small></span>
                                        ) : (
                                            <span><small className="text-xl align-top mr-1">R$</small>{coupon.discount}</span>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium uppercase tracking-widest mt-2 opacity-50">
                                        Desconto Aplicado
                                    </p>
                                </div>

                                {/* Parte Inferior: Detalhes e Código */}
                                <div className={`p-6 pt-8 ${isValid ? 'bg-white/5' : 'bg-gray-50'}`}>

                                    {/* O CÓDIGO */}
                                    <div className="bg-black/20 rounded-lg p-3 flex justify-between items-center mb-6 border border-white/5 relative group/code cursor-pointer">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">CUPOM</span>
                                            <span className={`font-mono text-xl font-bold tracking-widest ${isValid ? 'text-white' : 'text-gray-500'}`}>
                                                {coupon.code}
                                            </span>
                                        </div>
                                        <Copy className="h-5 w-5 opacity-50 group-hover/code:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Detalhes (Grid) */}
                                    <div className="space-y-3 text-sm font-medium">
                                        {/* Categoria */}
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded bg-white/10">
                                                <Layers className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="truncate opacity-70">
                                                {coupon.category ? `Apenas em ${coupon.category.name}` : "Válido em toda a loja"}
                                            </span>
                                        </div>

                                        {/* Validade */}
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded ${isExpired ? 'bg-red-500/20 text-red-500' : 'bg-white/10'}`}>
                                                <Calendar className="h-3.5 w-3.5" />
                                            </div>
                                            <span className={`opacity-70 ${isExpired ? 'text-red-500 font-bold' : ''}`}>
                                                {coupon.expiresAt
                                                    ? `Vence em ${new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}`
                                                    : "Sem data de validade"}
                                            </span>
                                        </div>

                                        {/* Usos (Barra de Progresso) */}
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 opacity-60">
                                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Utilizações</span>
                                                <span>{coupon.usedCount} / {coupon.maxUses || '∞'}</span>
                                            </div>
                                            {coupon.maxUses && (
                                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${isDepleted ? 'bg-red-500' : 'bg-yellow-500'}`}
                                                        style={{ width: `${usagePercent}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
                                        <Link
                                            href={`/admin/cupons/${coupon.id}`}
                                            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded text-sm font-bold transition-colors ${isValid ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                        >
                                            <Edit className="h-4 w-4" /> Editar
                                        </Link>

                                        <form action={deleteCouponFormAction}>
                                            <input type="hidden" name="id" value={coupon.id} />
                                            <button
                                                className={`px-4 py-2 rounded transition-colors flex items-center justify-center ${isValid ? 'bg-white/10 hover:bg-red-500 hover:text-white text-gray-300' : 'bg-gray-200 text-red-500 hover:bg-red-100'}`}
                                                title="Excluir Cupom"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* --- EMPTY STATE --- */}
                {coupons.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <AlertCircle className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Nenhum cupom ativo</h3>
                        <p className="text-gray-500 max-w-md mt-2 mb-8">
                            Crie tickets dourados para seus clientes e veja as vendas aumentarem.
                        </p>
                        <Link
                            href="/admin/cupons/novo"
                            className="bg-black text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            Criar Primeiro Cupom
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
