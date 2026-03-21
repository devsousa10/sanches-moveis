"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string | null | undefined) {
    if (!text) return "";
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

export async function updateProduct(formData: FormData) {
    const idString = formData.get("id") as string;
    const id = idString && idString !== "0" ? Number(idString) : null;

    const name = (formData.get("name") as string) || "";
    const description = (formData.get("description") as string) || "";
    const categoryId = parseInt(formData.get("categoryId") as string);

    const priceRaw = formData.get("price") as string;
    const priceString = priceRaw ? priceRaw.replace("R$", "").replace(/\./g, "").replace(",", ".") : "0";
    const price = parseFloat(priceString) || 0;

    const discountPercent = parseInt(formData.get("discountPercent") as string) || 0;

    // Status e Destaques
    const isActive = formData.get("isActive") === "true";
    const featured = formData.get("featured") === "true";

    // Ofertas
    const isOffer = formData.get("isOffer") === "true";
    const offerExpiresAtString = formData.get("offerExpiresAt") as string;
    const offerExpiresAt = offerExpiresAtString ? new Date(offerExpiresAtString) : null;

    // --- CORREÇÃO DO BUG DO ZERO ---
    // Parcelamento: Se vier vazio/nulo, usa 12. Se vier "0", usa 0.
    const maxInstallmentsRaw = formData.get("maxInstallments") as string;
    const maxInstallments = maxInstallmentsRaw ? parseInt(maxInstallmentsRaw) : 12;

    const freeInstallmentsRaw = formData.get("freeInstallments") as string;
    // Aqui garantimos que se for "0", ele respeita o 0.
    const freeInstallments = (freeInstallmentsRaw !== null && freeInstallmentsRaw !== "")
        ? parseInt(freeInstallmentsRaw)
        : 12;

    // JSONs
    const imagesJson = (formData.get("images") as string) || "[]";
    const images = JSON.parse(imagesJson);

    const variantsJson = (formData.get("variants") as string) || "[]";
    const variants = JSON.parse(variantsJson);

    // Specs
    const width = parseFloat(formData.get("width") as string) || 0;
    const height = parseFloat(formData.get("height") as string) || 0;
    const depth = parseFloat(formData.get("depth") as string) || 0;
    const weight = parseFloat(formData.get("weight") as string) || 0;

    const stockRaw = formData.get("stock") as string;
    const stockInput = stockRaw ? parseInt(stockRaw) : 0;

    const totalStock = variants.length > 0
        ? variants.reduce((acc: number, v: any) => acc + Number(v.stock), 0)
        : stockInput;

    const uniqueSuffix = id ? id : Date.now();
    const slug = `${slugify(name)}-${uniqueSuffix}`;

    try {
        const data = {
            name,
            slug,
            description,
            categoryId,
            price,
            discountPercent,
            featured,
            isActive,
            isOffer,
            offerExpiresAt,
            maxInstallments,
            freeInstallments,
            images,
            width,
            height,
            depth,
            weight,
            stock: totalStock,
        };

        if (id) {
            // EDIÇÃO
            await prisma.$transaction(async (tx) => {
                await tx.product.update({
                    where: { id },
                    data,
                });

                await tx.productVariant.deleteMany({ where: { productId: id } });
                if (variants.length > 0) {
                    await tx.productVariant.createMany({
                        data: variants.map((v: any) => ({
                            productId: id,
                            colorName: v.colorName,
                            colorValue: v.colorValue,
                            stock: Number(v.stock),
                            images: v.images
                        }))
                    });
                }
            });

        } else {
            // CRIAÇÃO
            await prisma.product.create({
                data: {
                    ...data,
                    // featured já vem do form ou false
                    variants: {
                        create: variants.map((v: any) => ({
                            colorName: v.colorName,
                            colorValue: v.colorValue,
                            stock: Number(v.stock),
                            images: v.images
                        }))
                    }
                },
            });
        }

    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        throw new Error("Erro ao salvar produto");
    }

    revalidatePath("/");
    revalidatePath("/admin/produtos");
    if (id) revalidatePath(`/admin/produtos/${id}`); // Força atualização da página de edição
    redirect("/admin/produtos");
}

export async function toggleProductStatus(id: number) {
    const product = await prisma.product.findUnique({ where: { id }, select: { isActive: true } });
    if (!product) return;

    await prisma.product.update({
        where: { id },
        data: { isActive: !product.isActive }
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/");
}

export async function toggleProductFeatured(id: number) {
    const product = await prisma.product.findUnique({ where: { id }, select: { featured: true } });
    if (!product) return;

    await prisma.product.update({
        where: { id },
        data: { featured: !product.featured }
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
    const id = Number(formData.get("id"));
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/produtos");
}