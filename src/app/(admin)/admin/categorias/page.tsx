import { deleteCategory } from "@/actions/categories";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2, Layers, ShoppingBag, TicketPercent, Star } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: { select: { products: true, coupons: true } }
        },
        orderBy: [
            { featured: 'desc' }, // Destaques primeiro
            { name: 'asc' }
        ]
    });

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Coleções <Layers className="h-8 w-8 text-purple-600" />
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Gerencie os departamentos da sua loja.</p>
                </div>

                <Link
                    href="/admin/categorias/nova"
                    className="group bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-900 transition-all transform hover:-translate-y-1 flex items-center gap-3 font-bold"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    Nova Coleção
                </Link>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-transparent transition-all duration-300">

                        {/* Imagem de Fundo (Aspect Ratio) */}
                        <div className="relative aspect-[4/5] overflow-hidden">
                            {cat.imageUrl ? (
                                <img
                                    src={cat.imageUrl}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-300">
                                    <Layers className="h-12 w-12 mb-2" />
                                    <span className="text-xs font-bold uppercase">Sem imagem</span>
                                </div>
                            )}

                            {/* Overlay Escuro (Sempre visível no fundo para ler texto, mais forte no hover) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                            {/* Badge de Destaque */}
                            {cat.featured && (
                                <div className="absolute top-4 right-4 bg-purple-500 text-white p-2 rounded-full shadow-lg z-10" title="Destaque na Home">
                                    <Star className="h-4 w-4 fill-white" />
                                </div>
                            )}

                            {/* Conteúdo Principal (Bottom) */}
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-12">
                                <h3 className="text-2xl font-black leading-tight mb-1">{cat.name}</h3>
                                <p className="text-sm text-white/70 line-clamp-1 mb-3">
                                    {cat.description || "Sem descrição definida."}
                                </p>

                                {/* Métricas (Pills) */}
                                <div className="flex gap-2">
                                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                        <ShoppingBag className="h-3 w-3" /> {cat._count.products}
                                    </span>
                                    {cat._count.coupons > 0 && (
                                        <span className="flex items-center gap-1.5 bg-yellow-500/20 backdrop-blur-md text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
                                            <TicketPercent className="h-3 w-3" /> {cat._count.coupons}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Botões de Ação (Aparecem no Hover) */}
                            <div className="absolute bottom-0 left-0 w-full p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/10 backdrop-blur-lg border-t border-white/10">
                                <Link
                                    href={`/admin/categorias/${cat.id}`}
                                    className="flex-1 flex justify-center items-center gap-2 bg-white text-black py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                                >
                                    <Edit className="h-4 w-4" /> Editar
                                </Link>
                                <form action={deleteCategory} className="flex">
                                    <input type="hidden" name="id" value={cat.id} />
                                    <button
                                        type="submit"
                                        className="bg-red-500/20 text-red-500 p-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {categories.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Layers className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">Nenhuma coleção encontrada.</p>
                        <p className="text-sm">Comece criando os departamentos da sua loja.</p>
                    </div>
                )}
            </div>
        </div>
    );
}