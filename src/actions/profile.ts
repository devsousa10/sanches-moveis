"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { hash } from "bcryptjs";

export async function updateProfile(formData: FormData) {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    if (!session?.value) {
        return { error: "Você não está logado." };
    }

    const userId = Number(session.value);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const cpf = formData.get("cpf") as string; // <--- NOVO
    const phone = formData.get("phone") as string; // <--- NOVO

    const data: any = { name };

    if (cpf) data.cpf = cpf;
    if (phone) data.phone = phone;

    if (password && password.trim() !== "") {
        data.password = await hash(password, 10);
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: data
        });

        revalidatePath("/minha-conta/perfil");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return { error: "Erro ao atualizar perfil." };
    }
}