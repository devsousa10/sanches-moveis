"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Configuração BLINDADA do Cookie
const getCookieOptions = () => {
    return {
        httpOnly: true, // Apenas o servidor acessa (segurança contra XSS)
        secure: process.env.NODE_ENV === "production", // HTTPS em produção, HTTP em dev
        sameSite: "lax" as const, // Permite navegação entre páginas mantendo o cookie
        maxAge: 60 * 60 * 24 * 7, // 7 dias de duração (Persistência)
        path: "/", // <--- OBRIGATÓRIO: Garante que funciona na Home, Checkout e Admin
    };
};

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = formData.get("redirectTo") as string;

    if (!email || !password) {
        return { error: "Preencha todos os campos." };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "E-mail ou senha inválidos." };
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return { error: "E-mail ou senha inválidos." };
        }

        // Definir Cookies
        const cookieStore = await cookies();
        const options = getCookieOptions();

        cookieStore.set("sanches_session", String(user.id), options);
        cookieStore.set("sanches_role", user.role, options);

    } catch (error) {
        console.error("Login error:", error);
        return { error: "Erro interno ao realizar login." };
    }

    if (redirectTo) {
        redirect(redirectTo);
    } else {
        // Redireciona baseado no cargo
        const userRole = await getUserRoleByEmail(email);
        if (userRole === "ADMIN") {
            redirect("/admin");
        } else {
            redirect("/minha-conta");
        }
    }
}

async function getUserRoleByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email }, select: { role: true } });
    return user?.role;
}

export async function register(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = formData.get("redirectTo") as string;

    if (!name || !email || !password) {
        return { error: "Preencha todos os campos." };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Este e-mail já está em uso." };
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER"
            }
        });

        // Definir Cookies Automaticamente ao Registrar
        const cookieStore = await cookies();
        const options = getCookieOptions();

        cookieStore.set("sanches_session", String(user.id), options);
        cookieStore.set("sanches_role", "USER", options);

    } catch (error) {
        console.error("Register error:", error);
        return { error: "Erro ao criar conta." };
    }

    if (redirectTo) {
        redirect(redirectTo);
    } else {
        redirect("/minha-conta");
    }
}

export async function logout() {
    const cookieStore = await cookies();

    // Remove os cookies forçando a expiração
    cookieStore.delete("sanches_session");
    cookieStore.delete("sanches_role");

    redirect("/login");
}