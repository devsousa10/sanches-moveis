"use server";

import { prisma } from "@/lib/prisma";

export async function getProductBySlug(slug: string) {
    return await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            variants: true
        }
    });
}

export async function getRelatedProducts(categoryId: number, currentProductId: number) {
    return await prisma.product.findMany({
        where: {
            categoryId,
            id: { not: currentProductId }, // Não mostrar o produto atual
            // isActive: true, // Descomente se tiver o campo isActive
        },
        take: 4, // Mostrar 4 relacionados
        orderBy: { featured: 'desc' }, // Prioriza destaques
        include: { category: true }
    });
}