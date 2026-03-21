"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { withDatabaseFallback } from "@/lib/database";

// Adicionar avaliação
export async function addReview(formData: FormData) {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    if (!session?.value) {
        return { error: "Você precisa estar logado para avaliar." };
    }

    const userId = Number(session.value);
    const productId = Number(formData.get("productId"));
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;

    if (!rating || rating < 1 || rating > 5) {
        return { error: "Nota inválida." };
    }

    if (!comment || comment.trim().length < 3) {
        return { error: "Escreva um comentário válido." };
    }

    try {
        await prisma.review.create({
            data: {
                userId,
                productId,
                rating,
                comment
            }
        });

        revalidatePath(`/produto/[slug]`, 'page');
        revalidatePath(`/minha-conta/avaliacoes`);
        revalidatePath(`/admin/avaliacoes`);
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar avaliação:", error);
        return { error: "Erro ao salvar avaliação." };
    }
}

// Apagar avaliação (Admin ou Dono)
export async function deleteReview(formData: FormData) {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    if (!session?.value) return { error: "Não autorizado." };

    const reviewId = Number(formData.get("id"));
    const userId = Number(session.value);

    try {
        // Busca o usuário para ver se é admin e a review para ver quem é o dono
        const [user, review] = await Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),
            prisma.review.findUnique({ where: { id: reviewId } })
        ]);

        if (!review) return { error: "Avaliação não encontrada." };

        // Permissão: É Admin OU é o dono da review
        if (user?.role !== "ADMIN" && review.userId !== userId) {
            return { error: "Permissão negada." };
        }

        await prisma.review.delete({ where: { id: reviewId } });

        revalidatePath(`/produto/[slug]`, 'page');
        revalidatePath(`/minha-conta/avaliacoes`);
        revalidatePath(`/admin/avaliacoes`);
        revalidatePath(`/admin`); // Atualiza o widget

        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir." };
    }
}

export async function deleteReviewFormAction(formData: FormData): Promise<void> {
    await deleteReview(formData);
}

// Buscar reviews de um produto
export async function getProductReviews(productId: number) {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    const currentUserId = session?.value ? Number(session.value) : null;

    const reviews = await withDatabaseFallback(
        () =>
            prisma.review.findMany({
                where: { productId },
                include: { user: { select: { id: true, name: true, role: true } } },
                orderBy: { createdAt: 'desc' }
            }),
        [],
        `getProductReviews.${productId}`
    );

    const total = reviews.length;
    const average = total > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / total
        : 0;

    return { reviews, average, total, currentUserId };
}

// Buscar reviews do usuário logado (Minha Conta)
export async function getUserReviews() {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    if (!session?.value) return [];

    return await prisma.review.findMany({
        where: { userId: Number(session.value) },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
    });
}

// Buscar todas as reviews (Admin)
export async function getAllReviews() {
    return await prisma.review.findMany({
        include: {
            product: { select: { name: true, slug: true, images: true } },
            user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}
