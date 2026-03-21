"use client";

import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
    }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => {
                addToCart(product);
                alert("Produto adicionado ao carrinho!"); // Feedback simples
            }}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-black px-8 py-4 font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95"
        >
            <ShoppingCart className="h-5 w-5" />
            Adicionar ao Carrinho
        </button>
    );
}