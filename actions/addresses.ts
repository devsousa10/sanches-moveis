"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getUserId() {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    if (!session?.value) return null;
    return Number(session.value);
}

export async function createAddress(formData: FormData) {
    const userId = await getUserId();
    if (!userId) redirect("/login");

    const name = formData.get("name") as string;
    const recipient = formData.get("recipient") as string;
    const cep = formData.get("cep") as string;
    const street = formData.get("street") as string;
    const number = formData.get("number") as string;
    const complement = formData.get("complement") as string;
    const neighborhood = formData.get("neighborhood") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    await prisma.address.create({
        data: {
            userId,
            name,
            recipient,
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state
        }
    });

    revalidatePath("/minha-conta/enderecos");
    redirect("/minha-conta/enderecos");
}

export async function updateAddress(formData: FormData) {
    const userId = await getUserId();
    if (!userId) redirect("/login");

    const id = Number(formData.get("id"));

    const name = formData.get("name") as string;
    const recipient = formData.get("recipient") as string;
    const cep = formData.get("cep") as string;
    const street = formData.get("street") as string;
    const number = formData.get("number") as string;
    const complement = formData.get("complement") as string;
    const neighborhood = formData.get("neighborhood") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    // Garante que o endereço é do usuário antes de editar
    const existing = await prisma.address.findFirst({
        where: { id, userId }
    });

    if (!existing) {
        throw new Error("Endereço não encontrado ou acesso negado.");
    }

    await prisma.address.update({
        where: { id },
        data: {
            name,
            recipient,
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state
        }
    });

    revalidatePath("/minha-conta/enderecos");
    redirect("/minha-conta/enderecos");
}

export async function deleteAddress(formData: FormData) {
    const userId = await getUserId();
    if (!userId) redirect("/login");

    const id = Number(formData.get("id"));

    const address = await prisma.address.findFirst({
        where: { id, userId }
    });

    if (address) {
        await prisma.address.delete({ where: { id } });
    }

    revalidatePath("/minha-conta/enderecos");
}