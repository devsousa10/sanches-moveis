import { ProductCard } from "@/components/ProductCard";
import { Search, Frown, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    // 1. Aguarda os parâmetros de busca
    const { q } = await searchParams;

    // 2. Se não tiver termo de busca, exibe tela inicial de busca
    if (!q) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="bg-white p-4 rounded-full shadow-sm inline-flex mb-4">
                        <Search className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">O que você procura hoje?</h1>
                    <p className="text-gray-500 mb-6">Digite o nome do móvel na barra de busca acima para começar.</p>
                    <Link href="/" className="text-sm font-bold text-black border-b border-black pb-0.5 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                        Voltar para a Home
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Busca no banco (Nome ou Descrição)
    let products: Array<any> = [];

    if (process.env.DATABASE_URL?.trim()) {
        try {
            products = await prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { description: { contains: q, mode: "insensitive" } },
                    ],
                },
                include: { category: true },
                orderBy: {
                    stock: 'desc'
                }
            });
        } catch (error) {
            console.error("[Database] Falha ao carregar pesquisa:", error);
        }
    } else {
        console.error("[Database] DATABASE_URL ausente em SearchPage.");
    }

    // 4. Formata para o Card (Decimal -> Number)
    const formattedProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        category: p.category.name,
        images: p.images,
        discountPercent: p.discountPercent,
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* BREADCRUMBS */}
            <div className="border-b border-gray-100 bg-white">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                            <Home className="h-3 w-3" /> Home
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-black">Pesquisa</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* CABEÇALHO DA BUSCA */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Resultados para <span className="text-yellow-600">"{q}"</span>
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Encontramos <strong>{products.length}</strong> produtos correspondentes.
                    </p>
                </div>

                {/* RESULTADOS */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {formattedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* ESTADO VAZIO */
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <Frown className="h-10 w-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Ops! Não encontramos nada.</h2>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            Verifique a ortografia ou tente termos mais gerais como "Sofá", "Mesa" ou "Cadeira".
                        </p>
                        <div className="flex gap-4">
                            <Link href="/" className="px-6 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                                Voltar ao Início
                            </Link>
                            <Link href="/categorias" className="px-6 py-2 bg-gray-100 text-gray-900 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                                Ver Categorias
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
