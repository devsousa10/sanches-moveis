"use client";

import { useState } from "react";
import { CreditCard, X, ChevronDown, Check } from "lucide-react";
import { InstallmentOption } from "@/actions/payment";

interface InstallmentModalProps {
    options: InstallmentOption[];
}

export function InstallmentModal({ options }: InstallmentModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Encontra a melhor opção sem juros para destacar
    const bestNoInterest = options
        .filter(o => o.installment_rate === 0)
        .sort((a, b) => b.installments - a.installments)[0];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-bold text-gray-500 underline decoration-dotted hover:text-black transition-colors flex items-center gap-1"
            >
                <CreditCard className="h-4 w-4" />
                Ver parcelas
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Opções de Parcelamento</h3>
                                <p className="text-sm text-gray-500">Cartão de Crédito</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Lista */}
                        <div className="overflow-y-auto p-6 space-y-3">
                            {options.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">Carregando opções...</p>
                            ) : (
                                options.map((opt) => {
                                    const isNoInterest = opt.installment_rate === 0;
                                    return (
                                        <div
                                            key={opt.installments}
                                            className={`flex justify-between items-center p-4 rounded-xl border ${isNoInterest ? 'border-green-200 bg-green-50/50' : 'border-gray-100 bg-white'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 flex items-center gap-2">
                                                    {opt.installments}x de {opt.installment_amount_formatted}
                                                    {isNoInterest && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-extrabold uppercase">Sem Juros</span>}
                                                </span>
                                                <span className="text-xs text-gray-500">Total: {opt.total_amount_formatted}</span>
                                            </div>
                                            {isNoInterest && <Check className="h-4 w-4 text-green-600" />}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}