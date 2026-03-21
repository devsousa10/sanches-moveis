import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 1. Pega o cookie de sessão
    const session = request.cookies.get("sanches_session")?.value;
    const role = request.cookies.get("sanches_role")?.value;

    const { pathname } = request.nextUrl;

    // 2. Rotas Públicas (Não precisa de login)
    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/produto") ||
        pathname.startsWith("/categorias") ||
        pathname.startsWith("/pesquisa") ||
        pathname.startsWith("/carrinho") ||
        pathname === "/login" ||
        pathname === "/cadastro";

    // 3. Proteção de Rotas ADMIN
    if (pathname.startsWith("/admin")) {
        if (!session || role !== "ADMIN") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 4. Proteção de Rotas de CLIENTE (Minha Conta, Checkout)
    // Se tentar acessar e não tiver sessão, manda pro login
    if ((pathname.startsWith("/minha-conta") || pathname.startsWith("/checkout")) && !session) {
        // Salva a url que ele queria ir para redirecionar depois
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 5. Se já estiver logado e tentar ir pro Login, manda pro painel
    if (pathname === "/login" && session) {
        if (role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/minha-conta", request.url));
    }

    return NextResponse.next();
}

// Configura em quais rotas o middleware vai rodar
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public images
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|webp|svg)).*)",
    ],
};