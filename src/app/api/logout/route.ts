import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // Acessa a loja de cookies
    const cookieStore = await cookies();

    // Deleta os cookies de sessão violentamente
    cookieStore.delete("sanches_session");
    cookieStore.delete("sanches_role");

    // Redireciona para a página de login limpa
    return NextResponse.redirect(new URL("/login", request.url));
}