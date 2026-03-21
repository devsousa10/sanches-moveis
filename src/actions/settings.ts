"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
    const storeName = formData.get("storeName") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {
            storeName,
            phone,
            address
        },
        create: {
            id: 1,
            storeName,
            phone,
            address
        }
    });

    revalidatePath("/");
    revalidatePath("/admin/configuracoes");
}
