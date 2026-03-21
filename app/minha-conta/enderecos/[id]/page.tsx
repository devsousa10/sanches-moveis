import { AddressForm } from "@/components/customer/AddressForm";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const addressId = Number(id);

    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    if (!session?.value) redirect("/login");

    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId: Number(session.value) // Segurança: só busca se for do usuário
        }
    });

    if (!address) return notFound();

    return <AddressForm address={address} />;
}