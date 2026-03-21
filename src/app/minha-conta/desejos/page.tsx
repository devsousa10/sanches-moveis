import { prisma } from "@/lib/prisma";
import { removeFromWishlist } from "@/actions/wishlist";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
    // 1. Autenticação
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    if (!session?.value) redirect("/login");

    // 2. Busca Dados
    const user = await prisma.user.findUnique({
        where: { id: Number(session.value) },
        include: {
            wishlist: {
                include: { category: true } // Para mostrar categoria no card
            }
        }
    });

    if (!user) redirect("/login");

    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <Heart className="h-8 w-8 text-red-500 fill-red-500" /> Minha Curadoria
                    </h1>
                    <p className="text-gray-500 mt-2">Uma seleção exclusiva dos seus itens favoritos.</p>
                </div>

                {user.wishlist.length > 0 && (
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        {user.wishlist.length} {user.wishlist.length === 1 ? 'Item' : 'Itens'} Salvos
                    </div>
                )}
            </div>

            {user.wishlist.length === 0 ? (
                // EMPTY STATE PREMIUM
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                    <div className="relative z-10 bg-gray-50 p-6 rounded-full mb-6 animate-pulse">
                        <Heart className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 relative z-10">Sua coleção está vazia</h3>
                    <p className="text-gray-500 max-w-sm text-center mb-8 relative z-10">
                        Explore nosso showroom e clique no coração para salvar o que te inspira.
                    </p>
                    <Link
                        href="/"
                        className="relative z-10 bg-black text-white px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 group"
                    >
                        Explorar Showroom <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            ) : (
                // GRID DE GALERIA
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {user.wishlist.map((product) => (
                        <div key={product.id} className="group relative bg-white rounded-[32px] p-3 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">

                            {/* Botão Remover (Flutuante) */}
                            <form action={removeFromWishlist} className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <input type="hidden" name="productId" value={product.id} />
                                <button
                                    className="p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full shadow-sm hover:bg-white transition-colors"
                                    title="Remover da lista"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </form>

                            {/* Área da Imagem */}
                            <div className="relative aspect-[4/5] bg-gray-100 rounded-[24px] overflow-hidden mb-4">
                                {product.images[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Sparkles className="h-10 w-10" />
                                    </div>
                                )}

                                {/* Overlay de Ação Rápida */}
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                                    <Link
                                        href={`/produto/${product.slug}`}
                                        className="bg-white text-black text-xs font-bold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                                    >
                                        <ShoppingBag className="h-3 w-3" /> Ver Detalhes
                                    </Link>
                                </div>
                            </div>

                            {/* Informações */}
                            <div className="px-2 pb-2">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category.name}</p>
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">
                                            Poucas Unidades
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-1" title={product.name}>
                                    {product.name}
                                </h3>

                                <div className="flex items-end justify-between">
                                    <div>
                                        {product.discountPercent > 0 && (
                                            <p className="text-xs text-gray-400 line-through">
                                                {formatMoney(Number(product.price))}
                                            </p>
                                        )}
                                        <p className="text-xl font-black text-gray-900">
                                            {formatMoney(Number(product.price) * (1 - product.discountPercent / 100))}
                                        </p>
                                    </div>

                                    {/* Link invisível que cobre o card (exceto o botão de remover) para UX mobile */}
                                    <Link href={`/produto/${product.slug}`} className="absolute inset-0 z-10 md:hidden" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}