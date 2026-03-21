"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function saveUser(formData: FormData) {
    const idString = formData.get("id") as string;
    const id = idString && idString !== "0" ? Number(idString) : null;

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const passwordRaw = formData.get("password") as string;

    const data: any = {
        name,
        email,
        role
    };

    // Só atualiza senha se o usuário digitou algo
    if (passwordRaw && passwordRaw.trim() !== "") {
        const hashedPassword = await bcrypt.hash(passwordRaw, 10);
        data.password = hashedPassword;
    } else if (!id) {
        // Se for criação nova e não tiver senha
        throw new Error("Senha é obrigatória para novos usuários");
    }

    try {
        if (id) {
            // EDITAR
            await prisma.user.update({
                where: { id },
                data
            });
        } else {
            // CRIAR
            // Verifica se email já existe
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                // Em produção, ideal é retornar erro visual, aqui faremos um redirect ou log
                console.error("Email já existe");
                return;
            }

            await prisma.user.create({
                data: {
                    ...data,
                    // Garante que password existe na criação
                    password: data.password
                }
            });
        }
    } catch (error) {
        console.error("Erro ao salvar usuário:", error);
    }

    revalidatePath("/admin/usuarios");
    redirect("/admin/usuarios");
}

export async function deleteUser(formData: FormData) {
    const id = Number(formData.get("id"));
    // Proteção básica: Evitar deletar o próprio admin (idealmente checaria sessão)
    try {
        await prisma.user.delete({ where: { id } });
        revalidatePath("/admin/usuarios");
    } catch (error) {
        console.error("Erro ao deletar usuário");
    }
}

export async function toggleUserRole(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return;

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    await prisma.user.update({
        where: { id },
        data: { role: newRole }
    });

    revalidatePath("/admin/usuarios");
}