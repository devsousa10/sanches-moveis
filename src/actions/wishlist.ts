"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Usado via Client Component (onClick) -> Recebe number direto
export async function toggleWishlist(productId: number) {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    if (!session?.value) {
        redirect("/login");
    }

    const userId = Number(session.value);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { wishlist: { where: { id: productId } } }
    });

    if (!user) return { error: "Usuário não encontrado." };

    const exists = user.wishlist.length > 0;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                wishlist: {
                    [exists ? 'disconnect' : 'connect']: { id: productId }
                }
            }
        });

        revalidatePath("/minha-conta/desejos");
        revalidatePath("/produto/[slug]", "page");

        return { success: true, isLiked: !exists };
    } catch (error) {
        console.error("Erro ao atualizar wishlist:", error);
        return { error: "Erro interno ao atualizar lista de desejos." };
    }
}

// Usado via Form Action (Server Component) -> Recebe FormData
export async function removeFromWishlist(formData: FormData) {
    const productId = Number(formData.get("productId"));

    if (!productId) {
        return { error: "ID do produto inválido." };
    }

    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    if (!session?.value) {
        redirect("/login");
    }

    const userId = Number(session.value);

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                wishlist: {
                    disconnect: { id: productId }
                }
            }
        });

        revalidatePath("/minha-conta/desejos");
        revalidatePath("/produto/[slug]", "page");

        return { success: true };
    } catch (error) {
        console.error("Erro ao remover da wishlist:", error);
        return { error: "Erro interno ao remover item." };
    }
}

export async function removeFromWishlistFormAction(formData: FormData): Promise<void> {
    await removeFromWishlist(formData);
}
