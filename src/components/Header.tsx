"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Star } from "lucide-react"; // Adicionei 'Star' aqui
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
    const { cartCount } = useCart();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/pesquisa?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">

                {/* 1. Logo e Menu Mobile */}
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 text-black hover:text-red-600 transition-colors">
                        <Menu className="h-6 w-6" />
                    </button>

                    <Link href="/" className="flex items-center gap-2 group">
                        {/* EMBLEMA: Fundo Vermelho + Estrela Amarela */}
                        <div className="h-10 w-10 bg-red-700 flex items-center justify-center rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300">
                            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                        </div>

                        <div className="flex flex-col -space-y-1">
                            <span className="text-xl font-extrabold text-black tracking-tight group-hover:text-red-700 transition-colors">
                                Sanches
                            </span>
                            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">
                                Móveis
                            </span>
                        </div>
                    </Link>
                </div>

                {/* 2. Barra de Busca Funcional */}
                <div className="hidden md:flex flex-1 items-center justify-center px-8">
                    <form onSubmit={handleSearch} className="relative w-full max-w-lg">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="O que você procura hoje?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-400"
                        />
                    </form>
                </div>

                {/* 3. Ações */}
                <div className="flex items-center gap-6">
                    <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-red-600 transition-colors">
                        <User className="h-5 w-5" />
                        <span className="hidden md:inline">Minha Conta</span>
                    </Link>

                    <Link
                        href="/carrinho"
                        className="relative flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        <span className="sr-only">Carrinho</span>
                        {cartCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 border-2 border-white text-[10px] font-bold text-white animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}