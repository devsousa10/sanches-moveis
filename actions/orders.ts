"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData): Promise<void>;
export async function updateOrderStatus(id: string, status: string): Promise<void>;
export async function updateOrderStatus(formDataOrId: FormData | string, statusArg?: string) {
    const id = formDataOrId instanceof FormData
        ? (formDataOrId.get("id") as string)
        : formDataOrId;
    const status = formDataOrId instanceof FormData
        ? (formDataOrId.get("status") as string)
        : (statusArg as string);

    await prisma.order.update({
        where: { id },
        data: { status }
    });

    revalidatePath(`/admin/pedidos/${id}`);
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin"); // Dashboard
}

export async function updateTrackingCode(formData: FormData) {
    const id = formData.get("id") as string;
    const trackingCode = formData.get("trackingCode") as string;

    await prisma.order.update({
        where: { id },
        data: {
            trackingCode,
            status: "SHIPPED" // Se adicionou rastreio, move automatico para Enviado
        }
    });

    revalidatePath(`/admin/pedidos/${id}`);
    revalidatePath("/admin/pedidos");
}

export async function deleteOrder(formData: FormData) {
    // Geralmente não se deleta pedido, se arquiva. Mas manteremos o delete por consistência.
    const id = formData.get("id") as string;
    await prisma.order.delete({ where: { id } });
    revalidatePath("/admin/pedidos");
}
