"use client";

import { logout } from "@/actions/auth";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        // Nota: O redirect acontece no server, então essa função pode nem terminar de executar no client, 
        // o que é o comportamento esperado.
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
            {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="h-4 w-4" />
            )}
            {isLoggingOut ? "Saindo..." : "Sair da Conta"}
        </button>
    );
}