"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton() {
    // Hook para saber se está enviando o form
    const { pending } = useFormStatus();

    const handleClick = (e: React.MouseEvent) => {
        // Se o usuário cancelar, prevenimos o envio do form
        if (!confirm("Tem certeza absoluta que deseja excluir este item?")) {
            e.preventDefault();
        }
    };

    return (
        <button
            type="submit"
            onClick={handleClick}
            disabled={pending}
            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-all disabled:opacity-50"
            title="Excluir"
        >
            {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    );
}