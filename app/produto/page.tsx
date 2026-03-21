import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { withDatabaseFallback } from "@/lib/database";

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
    const products = await withDatabaseFallback(
        () =>
            prisma.product.findMany({
                include: {
                    category: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
        [],
        "AllProductsPage.products"
    );

    const formattedProducts = products.map((p) => ({
        ...p,
        price: Number(p.price),
        category: p.category.name,
    }));

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6">
                    <div>
                        <Link href="/" className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-600 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Voltar para Home
                        </Link>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Todos os Produtos
                        </h1>
                        <p className="mt-1 text-gray-500">
                            Confira nossa coleção completa de móveis de alta qualidade.
                        </p>
                    </div>

                    <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        {products.length} produtos encontrados
                    </div>
                </div>

                {formattedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {formattedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white text-center shadow-sm">
                        <Search className="mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado</h3>
                        <p className="text-gray-500">Parece que nosso estoque está vazio no momento.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
