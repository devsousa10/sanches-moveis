import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
    const email = "admin@sanches.com";
    const password = "123";
    const name = "Maycon Sanches";

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        return <div>O usuário {email} já existe!</div>;
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return (
        <div className="p-10 text-green-600 font-bold">
            Sucesso! Usuário {email} criado. <br />
            Senha criptografada salva no banco. <br />
            AGORA DELETE A PASTA /src/app/setup PARA SEGURANÇA!
        </div>
    );
}
