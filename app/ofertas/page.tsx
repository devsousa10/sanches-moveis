import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { Timer, Zap } from "lucide-react";
import Link from "next/link";
import { withDatabaseFallback } from "@/lib/database";

export const dynamic = "force-dynamic";

// Componente do Cronômetro (Simples visualmente)
function OfferTimer({ date }: { date: Date }) {
    // Nota: Para um timer dinâmico em tempo real, precisaríamos de um Client Component.
    // Aqui faremos uma exibição estática da data limite para simplificar o Server Component,
    // ou você pode transformar isso em um Client Component depois se quiser os segundos rodando.
    const dateString = new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-2 rounded-full border border-red-100 animate-pulse">
            <Timer className="w-5 h-5" />
            <span>Expira em: {dateString}</span>
        </div>
    );
}

export default async function OffersPage() {
    // Busca produtos marcados como oferta e que estão ativos
    const offers = await withDatabaseFallback(
        () =>
            prisma.product.findMany({
                where: {
                    isActive: true,
                    isOffer: true,
                },
                include: {
                    category: true,
                },
                orderBy: {
                    offerExpiresAt: 'asc',
                }
            }),
        [],
        "OffersPage.offers"
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header da Página de Ofertas */}
            <div className="bg-neutral-900 text-white py-16 px-4 mb-12 border-b-4 border-yellow-500">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-yellow-500 text-black rounded-full mb-6 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                        <Zap className="w-10 h-10 fill-black" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                        Ofertas <span className="text-yellow-500">Relâmpago</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Produtos selecionados com preços absurdos. Aproveite antes que o tempo acabe.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {offers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {offers.map((product) => (
                            <div key={product.id} className="relative group">
                                {/* Badge de Expiração acima do card */}
                                {product.offerExpiresAt && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-max">
                                        <OfferTimer date={product.offerExpiresAt} />
                                    </div>
                                )}

                                {/* Card do Produto */}
                                <ProductCard product={product} />

                                {/* Destaque visual extra */}
                                <div className="absolute inset-0 border-2 border-yellow-500/0 group-hover:border-yellow-500/50 rounded-2xl pointer-events-none transition-all duration-300" />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Estado Vazio
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma oferta ativa no momento</h2>
                        <p className="text-gray-500 mb-8">Fique ligado! Nossas promoções relâmpago voltam a qualquer momento.</p>
                        <Link
                            href="/produto"
                            className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-colors"
                        >
                            Ver todos os produtos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
