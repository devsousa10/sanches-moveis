import { toggleProductFeatured, toggleProductStatus, deleteProduct } from "@/actions/products";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, Star, Package, Box } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; cat?: string }>;
}) {
    const { q, cat } = await searchParams;

    // Buscas
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    const where: any = {};
    if (q) where.name = { contains: q, mode: 'insensitive' };
    if (cat) where.categoryId = Number(cat);

    const products = await prisma.product.findMany({
        where,
        orderBy: { id: 'desc' },
        include: { category: true, variants: true }
    });

    // Função de busca (Action)
    async function handleSearch(formData: FormData) {
        "use server";
        const query = formData.get("q") as string;
        const categoryId = formData.get("cat") as string;
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (categoryId) params.set("cat", categoryId);
        redirect(`/admin/produtos?${params.toString()}`);
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Produtos <Box className="h-6 w-6 text-gray-400" />
                    </h1>
                    <p className="text-gray-500 mt-2">Gerencie seu catálogo com precisão.</p>
                </div>
                <Link
                    href="/admin/produtos/novo"
                    className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-900 hover:-translate-y-1 transition-all flex items-center gap-2 font-bold"
                >
                    <Plus className="h-4 w-4" /> Novo Produto
                </Link>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <form action={handleSearch} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Buscar produto por nome..."
                            className="w-full pl-10 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none font-medium"
                        />
                    </div>
                    <div className="w-full md:w-64 relative">
                        <Filter className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        <select
                            name="cat"
                            defaultValue={cat}
                            className="w-full pl-10 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none appearance-none font-medium cursor-pointer"
                        >
                            <option value="">Todas as Categorias</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="bg-gray-200 text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                        Filtrar
                    </button>
                    {(q || cat) && (
                        <Link href="/admin/produtos" className="bg-red-50 text-red-500 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center">
                            Limpar
                        </Link>
                    )}
                </form>
            </div>

            {/* Grid de Produtos (Showroom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                    const mainImage = product.images[0] || null;
                    const stockStatus = product.stock <= 0 ? 'bg-red-100 text-red-600' : product.stock < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
                    const stockLabel = product.stock <= 0 ? 'Esgotado' : product.stock < 5 ? 'Baixo' : 'Em estoque';

                    return (
                        <div key={product.id} className={`group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${!product.isActive ? 'opacity-75 grayscale-[0.5]' : ''}`}>

                            {/* Imagem + Ações Flutuantes */}
                            <div className="relative aspect-square bg-gray-50">
                                {mainImage ? (
                                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package className="h-12 w-12" />
                                    </div>
                                )}

                                {/* Badge Categoria */}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    {product.category.name}
                                </div>

                                {/* Ações Rápidas (Overlay) */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    {/* Botão Destaque */}
                                    <form action={toggleProductFeatured.bind(null, product.id)}>
                                        <button className={`p-2 rounded-full shadow-md transition-colors ${product.featured ? 'bg-yellow-400 text-black' : 'bg-white text-gray-400 hover:text-yellow-400'}`}>
                                            <Star className={`h-4 w-4 ${product.featured ? 'fill-black' : ''}`} />
                                        </button>
                                    </form>

                                    {/* Botão Visibilidade */}
                                    <form action={toggleProductStatus.bind(null, product.id)}>
                                        <button className={`p-2 rounded-full shadow-md transition-colors ${product.isActive ? 'bg-white text-gray-600 hover:text-black' : 'bg-gray-800 text-white'}`}>
                                            {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Informações */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 truncate pr-2" title={product.name}>{product.name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${stockStatus}`}>
                                        {stockLabel} ({product.stock})
                                    </span>
                                </div>

                                <div className="flex items-end justify-between mb-4">
                                    <div className="flex flex-col">
                                        {product.discountPercent > 0 && (
                                            <span className="text-xs text-gray-400 line-through">
                                                R$ {Number(product.price).toFixed(2)}
                                            </span>
                                        )}
                                        <span className="text-lg font-black text-gray-900">
                                            R$ {(Number(product.price) * (1 - product.discountPercent / 100)).toFixed(2)}
                                        </span>
                                    </div>
                                    {product.variants.length > 0 && (
                                        <div className="flex -space-x-2">
                                            {product.variants.slice(0, 3).map((v, i) => (
                                                <div
                                                    key={v.id}
                                                    className="w-4 h-4 rounded-full border border-white ring-1 ring-gray-100"
                                                    style={{ backgroundColor: v.colorValue }}
                                                    title={v.colorName}
                                                />
                                            ))}
                                            {product.variants.length > 3 && (
                                                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 border border-white ring-1 ring-gray-100">
                                                    +{product.variants.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer do Card */}
                                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                    <Link
                                        href={`/admin/produtos/${product.id}`}
                                        className="flex-1 text-center bg-black text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Editar
                                    </Link>
                                    <form action={deleteProduct}>
                                        <input type="hidden" name="id" value={product.id} />
                                        <DeleteButton />
                                    </form>
                                </div>
                            </div>

                        </div>
                    );
                })}

                {products.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100">
                        <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Nenhum produto encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}