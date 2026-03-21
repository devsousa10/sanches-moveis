"use client";

import { toggleWishlist } from "@/actions/wishlist";
import { Heart } from "lucide-react";
import { useState } from "react";
// import { toast } from "sonner"; // Descomente se for usar toast no futuro

interface WishlistButtonProps {
    productId: number;
    initialIsLiked: boolean;
}

export function WishlistButton({ productId, initialIsLiked }: WishlistButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        // UI Otimista: muda o estado visualmente antes da resposta
        const previousState = isLiked;
        setIsLiked(!previousState);
        setIsLoading(true);

        try {
            const result = await toggleWishlist(productId);

            // Se houver erro retornado (ex: falha no banco), reverte
            if (result?.error) {
                setIsLiked(previousState);
                alert(result.error); // Pode substituir por toast.error(result.error)
            }
        } catch (error) {
            // Nota: O redirect do Server Action pode ser capturado aqui dependendo da versão do Next.js,
            // mas o comportamento padrão de navegação ocorrerá.
            console.error("Erro na requisição:", error);
            // Não revertemos imediatamente aqui pois pode ser um redirect em andamento
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`
                group h-14 w-14 flex items-center justify-center rounded-full border-2 transition-all duration-300
                ${isLiked
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black"
                }
            `}
            title={isLiked ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        >
            <Heart
                className={`
                    h-6 w-6 transition-transform duration-300 
                    ${isLiked ? "fill-current scale-110" : "group-hover:scale-110"}
                    ${isLoading ? "animate-pulse" : ""}
                `}
            />
        </button>
    );
}