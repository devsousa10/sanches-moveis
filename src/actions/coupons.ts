"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCoupon(formData: FormData) {
    const code = formData.get("code") as string;
    const discountString = formData.get("discount");
    const type = formData.get("type") as string; // 'PERCENT' ou 'FIXED'
    const expiresAtString = formData.get("expiresAt");
    const maxUsesString = formData.get("maxUses");
    const categoryIdString = formData.get("categoryId");

    // Checkbox: se marcado vem "on"
    const isActive = formData.get("isActive") === "on";

    if (!code || !discountString) {
        return { error: "Código e Desconto são obrigatórios." };
    }

    try {
        await prisma.coupon.create({
            data: {
                code: code.toUpperCase().trim(),
                // Schema usa 'discountValue', não 'discount'
                discountValue: Number(discountString),
                // Schema usa 'discountType', não 'type'
                discountType: type || "PERCENT",
                // Schema usa 'usageLimit', não 'maxUses'
                usageLimit: maxUsesString ? Number(maxUsesString) : null,

                isActive,
                expiresAt: expiresAtString ? new Date(expiresAtString as string) : null,
                categoryId: (categoryIdString && categoryIdString !== "") ? Number(categoryIdString) : null
            }
        });
    } catch (error) {
        console.error("Erro ao criar cupom:", error);
        return { error: "Erro ao criar. Verifique se o código já existe." };
    }

    revalidatePath("/admin/cupons");
    redirect("/admin/cupons");
}

export async function updateCoupon(formData: FormData) {
    const id = Number(formData.get("id"));
    const code = formData.get("code") as string;
    const discountString = formData.get("discount");
    const type = formData.get("type") as string;
    const expiresAtString = formData.get("expiresAt");
    const maxUsesString = formData.get("maxUses");
    const categoryIdString = formData.get("categoryId");

    const isActive = formData.get("isActive") === "on";

    try {
        await prisma.coupon.update({
            where: { id },
            data: {
                code: code.toUpperCase().trim(),
                // Mapeando para os nomes corretos do Schema
                discountValue: Number(discountString),
                discountType: type || "PERCENT",
                usageLimit: maxUsesString ? Number(maxUsesString) : null,

                isActive: isActive,
                expiresAt: expiresAtString ? new Date(expiresAtString as string) : null,
                categoryId: (categoryIdString && categoryIdString !== "") ? Number(categoryIdString) : null
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar cupom:", error);
        return { error: "Erro ao atualizar cupom." };
    }

    revalidatePath("/admin/cupons");
    redirect("/admin/cupons");
}

export async function deleteCoupon(formData: FormData) {
    const id = Number(formData.get("id"));

    try {
        await prisma.coupon.delete({
            where: { id }
        });
        revalidatePath("/admin/cupons");
    } catch (error: any) {
        // Tratamento para exclusão duplicada ou registro inexistente
        if (error.code === 'P2025') {
            // Se já não existe, consideramos sucesso e apenas atualizamos a lista
            revalidatePath("/admin/cupons");
            return;
        }

        console.error("Erro ao deletar:", error);
        return { error: "Erro ao excluir cupom." };
    }
}
