import { CouponForm } from "@/components/admin/CouponForm";
import { prisma } from "@/lib/prisma";

export default async function NewCouponPage() {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return <CouponForm categories={categories} />;
}