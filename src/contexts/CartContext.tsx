"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartProduct {
    id: number;
    name: string;
    price: number;
    image?: string | null;
    quantity?: number;
    slug?: string;
    variantId?: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: CartProduct) => void;
    decreaseQuantity: (productId: number) => void; // <--- NOVA FUNÇÃO
    removeFromCart: (productId: number) => void;
    cartCount: number;
}

const CartContext = createContext({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("sanches-cart");
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("sanches-cart", JSON.stringify(items));
    }, [items]);

    function addToCart(product: CartProduct) {
        setItems((prev) => {
            const itemExists = prev.find((item) => item.id === product.id);
            const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;

            if (itemExists) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            }

            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image || "",
                    quantity: quantityToAdd,
                },
            ];
        });
    }

    // --- NOVA FUNÇÃO: Diminuir Quantidade ---
    function decreaseQuantity(productId: number) {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === productId) {
                    // Só diminui se for maior que 1. Se for 1, mantém (usuário deve usar o botão remover)
                    return { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 };
                }
                return item;
            })
        );
    }

    function removeFromCart(productId: number) {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    }

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, decreaseQuantity, removeFromCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
