"use client";

import { usePathname } from "next/navigation";

interface LayoutResizerProps {
    children: React.ReactNode;
    type?: "public"; // Indica que é um elemento público (Header/Footer da loja)
}

export function LayoutResizer({ children, type }: LayoutResizerProps) {
    const pathname = usePathname();

    // Lista de rotas que possuem layout próprio e NÃO devem mostrar o Header/Footer público
    const isPrivateLayout =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/minha-conta");

    // Se for um elemento público (tipo Header) e estivermos numa rota privada, esconde.
    if (type === "public" && isPrivateLayout) {
        return null;
    }

    return <>{children}</>;
}