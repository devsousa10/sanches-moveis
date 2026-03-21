import { ProductMainSection } from "@/components/store/ProductMainSection";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight, Home, ArrowRight } from "lucide-react";
import { cookies } from "next/headers";
import { getProductReviews } from "@/actions/reviews";
import { getInstallmentOptions } from "@/actions/payment";
import { ReviewsSection } from "@/components/shop/ReviewsSection";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            variants: true
        }
    });

    if (!product) return notFound();

    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    // Prepara dados de parcelamento (com fallback seguro)
    const maxInstallments = product.maxInstallments ?? 12;
    const freeInstallments = product.freeInstallments ?? 0;
    const priceWithDiscount = Number(product.price) * (1 - product.discountPercent / 100);

    const [userData, relatedProducts, reviewsData, installmentOptions] = await Promise.all([
        session?.value
            ? prisma.user.findUnique({
                where: { id: Number(session.value) },
                include: { wishlist: { where: { id: product.id } } }
            })
            : null,

        prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                isActive: true
            },
            take: 4,
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        }),

        getProductReviews(product.id),
        // CORREÇÃO: Calcula no servidor e passa para o componente. 
        // Isso resolve o "Calculando parcelas..." e o bug do "12x".
        getInstallmentOptions(priceWithDiscount, maxInstallments, freeInstallments)
    ]);

    const initialIsLiked = userData ? userData.wishlist.length > 0 : false;

    // Serializa os dados numéricos para evitar warning do Next.js
    const serializedProduct = {
        ...product,
        price: Number(product.price),
        width: Number(product.width),
        height: Number(product.height),
        depth: Number(product.depth),
        weight: Number(product.weight),
        maxInstallments,
        freeInstallments,
        categoryName: product.category.name,
        variants: product.variants.map(v => ({ ...v, stock: Number(v.stock) })),
        ratingAverage: reviewsData.average,
        ratingCount: reviewsData.total
    };

    const serializedRelated = relatedProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        category: p.category.name,
        images: p.images,
        discountPercent: p.discountPercent,
        isOffer: p.isOffer,
        maxInstallments: p.maxInstallments,
        freeInstallments: p.freeInstallments
    }));

    return (
        <div className="min-h-screen bg-white pb-32">
            <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                            <Home className="h-3 w-3 mb-0.5" /> Home
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href={`/categorias/${product.category.slug}`} className="hover:text-black transition-colors">
                            {product.category.name}
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-black truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="relative">
                    <ProductMainSection
                        product={serializedProduct}
                        isLiked={initialIsLiked}
                        installmentOptions={installmentOptions} // Passamos as parcelas prontas!
                    />
                </div>

                <ReviewsSection
                    productId={product.id}
                    reviews={reviewsData.reviews}
                    average={reviewsData.average}
                    total={reviewsData.total}
                    currentUserId={reviewsData.currentUserId}
                />

                {serializedRelated.length > 0 && (
                    <div className="mt-32 pt-16 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Complete o Ambiente</h2>
                                <p className="text-gray-500">Peças que combinam perfeitamente com sua escolha.</p>
                            </div>
                            <Link href={`/categorias/${product.category.slug}`} className="group flex items-center gap-2 text-sm font-bold bg-gray-100 hover:bg-black hover:text-white px-6 py-3 rounded-full transition-all">
                                Ver coleção completa <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {serializedRelated.map((related) => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
