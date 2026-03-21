import { CategoryForm } from "@/components/admin/CategoryForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const catId = Number(id);

    if (isNaN(catId)) return notFound();

    const category = await prisma.category.findUnique({ where: { id: catId } });
    if (!category) return notFound();

    return <CategoryForm category={category} />;
}