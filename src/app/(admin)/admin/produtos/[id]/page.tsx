import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) return notFound();

    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: productId },
            include: { variants: true }
        }),
        prisma.category.findMany({ orderBy: { name: 'asc' } })
    ]);

    if (!product) return notFound();

    // Conversão de Decimal para Number para evitar erro de serialização do Next.js
    // Server Components não podem passar objetos do tipo Decimal diretamente para Client Components
    const serializedProduct = {
        ...product,
        price: Number(product.price),
        width: product.width ? Number(product.width) : 0,
        height: product.height ? Number(product.height) : 0,
        depth: product.depth ? Number(product.depth) : 0,
        weight: product.weight ? Number(product.weight) : 0,
    };

    return <ProductForm product={serializedProduct} categories={categories} />;
}