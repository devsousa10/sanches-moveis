"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/orders";
import { Loader2, Check } from "lucide-react";

interface StatusButtonProps {
    orderId: string;
    currentStatus: string;
}

export function StatusButton({ orderId, currentStatus }: StatusButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleStatusChange(newStatus: string) {
        if (newStatus === currentStatus) return;
        setLoading(true);
        await updateOrderStatus(orderId, newStatus);
        setLoading(false);
    }

    return (
        <div className="flex items-center gap-2">
            <select
                disabled={loading}
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5"
            >
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago / Aprovado</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELED">Cancelado</option>
            </select>

            {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
            {!loading && <div className="w-4" />} {/* Espaçador para não pular */}
        </div>
    );
}