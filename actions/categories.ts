"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

export async function saveCategory(formData: FormData) {
    const id = formData.get("id") ? Number(formData.get("id")) : null;
    const name = formData.get("name") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const description = formData.get("description") as string;
    const featured = formData.get("featured") === "on";

    const slug = slugify(name);

    const data = {
        name,
        slug: id ? undefined : slug, // Evita mudar slug na edição para não quebrar links (opcional)
        imageUrl,
        description,
        featured
    };

    if (id) {
        // EDITAR
        // Se quiser permitir mudar o slug, remova o undefined acima e trate colisão
        await prisma.category.update({
            where: { id },
            data: {
                name,
                imageUrl,
                description,
                featured
            }
        });
    } else {
        // CRIAR NOVA
        // Lógica simples de colisão de slug
        let finalSlug = slug;
        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            finalSlug = `${slug}-${Date.now()}`;
        }

        await prisma.category.create({
            data: {
                name,
                slug: finalSlug,
                imageUrl,
                description,
                featured
            }
        });
    }

    revalidatePath("/");
    revalidatePath("/admin/categorias");
    redirect("/admin/categorias");
}

export async function deleteCategory(formData: FormData) {
    const id = Number(formData.get("id"));

    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath("/admin/categorias");
    } catch (error) {
        console.error("Erro ao excluir categoria.");
    }
}