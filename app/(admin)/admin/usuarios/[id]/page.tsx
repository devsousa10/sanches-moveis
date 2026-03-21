import { UserForm } from "@/components/admin/UserForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = Number(id);

    if (isNaN(userId)) return notFound();

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) return notFound();

    return <UserForm user={user} />;
}