import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    let user = null;

    if (session?.value) {
        user = await prisma.user.findUnique({
            where: { id: Number(session.value) },
            select: {
                name: true,
                email: true,
                cpf: true,     // Campo novo
                phone: true,   // Campo novo
                addresses: true // Endereços salvos
            }
        });
    }

    return <CheckoutClient user={user} />;
}
