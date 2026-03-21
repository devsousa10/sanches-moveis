import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    // Objeto vazio para inicializar o form
    const emptyProduct = {
        id: 0,
        name: "",
        images: [],
        variants: [],
        price: 0,
        discountPercent: 0,
        stock: 0,
        isActive: true
    };

    return <ProductForm product={emptyProduct} categories={categories} />;
}