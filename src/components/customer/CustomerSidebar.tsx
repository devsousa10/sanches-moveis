"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    MapPin,
    LogOut,
    UserCircle,
    Home,
    MessageSquare
} from "lucide-react";

const menuItems = [
    { name: "Visão Geral", icon: LayoutDashboard, path: "/minha-conta" },
    { name: "Meus Pedidos", icon: ShoppingBag, path: "/minha-conta/pedidos" },
    { name: "Endereços", icon: MapPin, path: "/minha-conta/enderecos" },
    { name: "Lista de Desejos", icon: Heart, path: "/minha-conta/desejos" },
    { name: "Minhas Avaliações", icon: MessageSquare, path: "/minha-conta/avaliacoes" }, // NOVO
    { name: "Dados Pessoais", icon: UserCircle, path: "/minha-conta/perfil" },
];

export function CustomerSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <aside className="w-64 bg-neutral-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50 hidden md:flex">
            <div className="h-20 flex items-center justify-center border-b border-neutral-800">
                <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
                    <span className="text-xl font-bold tracking-tight">MINHA CONTA</span>
                    <span className="text-xs text-yellow-500 tracking-widest">ÁREA DO CLIENTE</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                ? "bg-yellow-500 text-black shadow-lg"
                                : "text-gray-400 hover:bg-neutral-800 hover:text-white"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-800 space-y-2">
                <Link
                    href="/"
                    className="flex w-full items-center justify-center gap-2 bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                >
                    <Home className="h-4 w-4" />
                    Voltar à Loja
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </button>
            </div>
        </aside>
    );
}