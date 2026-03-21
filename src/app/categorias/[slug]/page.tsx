import { ProductCard } from "@/components/ProductCard";
import { CategoryControlBar } from "@/components/store/CategoryControlBar";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import Image from "next/image";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// --- BANCO DE IMAGENS INTELIGENTE (Links Atualizados) ---
const CATEGORY_IMAGES: Record<string, string> = {
    // Quartos (Link corrigido)
    "quartos": "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2500",
    "quarto": "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2500",
    "cama": "https://images.unsplash.com/photo-1505693416388-c03768abd43b?q=80&w=2070",

    // Salas
    "sala": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2500",
    "salas": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2500",
    "sofa": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070",

    // Cozinha e Jantar
    "cozinha": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070",
    "sala-de-jantar": "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2032",

    // Escritório
    "escritorio": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070",
    "home-office": "https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=2069",

    // Área Externa / Varanda
    "varanda": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    "jardim": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2032",

    // Banheiro
    "banheiro": "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069",

    // Decoração
    "decoracao": "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=2070"
};

// Imagem padrão caso não ache nenhuma
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage(props: CategoryPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
    const minPrice = typeof searchParams.min === 'string' ? parseFloat(searchParams.min) : undefined;
    const maxPrice = typeof searchParams.max === 'string' ? parseFloat(searchParams.max) : undefined;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };

    const priceFilter: Prisma.ProductWhereInput["price"] = (minPrice !== undefined || maxPrice !== undefined)
        ? { gte: minPrice ?? 0, lte: maxPrice ?? 1000000 }
        : undefined;

    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
        include: {
            products: {
                where: { price: priceFilter },
                orderBy: orderBy,
                include: { category: true }
            }
        }
    });

    if (!category) return notFound();

    const formattedProducts = category.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        category: p.category.name,
        images: p.images,
        discountPercent: p.discountPercent,
    }));

    // LÓGICA DE SELEÇÃO DA IMAGEM
    const bannerImage = category.imageUrl || CATEGORY_IMAGES[params.slug] || FALLBACK_IMAGE;

    return (
        <div className="min-h-screen bg-white">

            {/* --- HERO / BANNER --- */}
            <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-gray-900">
                <Image
                    src={bannerImage}
                    alt={category.name}
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-0 flex flex-col items-center justify-center container mx-auto px-4 md:px-6 z-10 text-center">
                    <span className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-2">Coleção Exclusiva</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white capitalize drop-shadow-lg tracking-tight">
                        {category.name}
                    </h1>
                </div>
            </div>

            {/* --- BARRA DE NAVEGAÇÃO & CONTROLES --- */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 md:px-6">
                    <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 py-3 border-b border-gray-50">
                        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                            <Home className="h-3 w-3" /> Home
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-black capitalize">{category.name}</span>
                    </nav>
                    <CategoryControlBar totalProducts={formattedProducts.length} />
                </div>
            </div>

            {/* --- GRID DE PRODUTOS --- */}
            <div className="container mx-auto px-4 md:px-6 py-10">
                {formattedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {formattedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <span className="text-4xl">🛋️</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ops! Nada por aqui.</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Não encontramos produtos nesta categoria com os filtros atuais.
                        </p>
                        <Link href={`/categorias/${params.slug}`} className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all">
                            Limpar Filtros
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
