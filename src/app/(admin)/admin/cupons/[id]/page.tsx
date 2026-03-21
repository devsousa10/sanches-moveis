import { CouponForm } from "@/components/admin/CouponForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditCouponPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: EditCouponPageProps) {
    const { id } = await params;

    // 1. Busca os dados
    const [coupon, categories] = await Promise.all([
        prisma.coupon.findUnique({
            where: { id: Number(id) }
        }),
        prisma.category.findMany({
            orderBy: { name: 'asc' }
        })
    ]);

    if (!coupon) return notFound();

    // 2. CORREÇÃO: Serializar MANUALMENTE (Prisma Decimal -> JS Number)
    // E mapear os nomes do banco (schema novo) para as props do componente (interface antiga/adaptada)
    const serializedCoupon = {
        id: coupon.id,
        code: coupon.code,
        // Banco: discountValue (Decimal) -> Componente: discount (number)
        discount: Number(coupon.discountValue),
        // Banco: discountType -> Componente: type
        type: coupon.discountType,
        isActive: coupon.isActive,
        expiresAt: coupon.expiresAt,
        // Banco: usageLimit -> Componente: maxUses
        maxUses: coupon.usageLimit,
        categoryId: coupon.categoryId,
        // Se precisar do minOrderValue no futuro, converta também:
        // minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null
    };

    // 3. Renderiza o formulário com os dados limpos
    return <CouponForm coupon={serializedCoupon} categories={categories} />;
}