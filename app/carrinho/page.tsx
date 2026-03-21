"use client";

import { useCart } from "@/contexts/CartContext";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { ShippingCalculator } from "@/components/ShippingCalculator";

export default function CartPage() {
    const { items, addToCart, decreaseQuantity, removeFromCart } = useCart();

    // Cálculo simples do total (sem descontos nesta etapa)
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    };

    // --- EMPTY STATE (Carrinho Vazio) ---
    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="rounded-[40px] bg-white p-12 text-center shadow-xl border border-gray-100 max-w-md w-full">
                    <div className="h-24 w-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Sua sacola está vazia</h1>
                    <p className="text-gray-500 mb-8 font-medium">Explore nosso catálogo e transforme sua casa com design exclusivo.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center w-full rounded-full bg-black py-4 font-bold text-white hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Começar a Comprar
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-20">

            {/* --- HEADER SIMPLIFICADO (Steps) --- */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <div className="flex justify-between items-center max-w-4xl mx-auto">
                        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Continuar comprando
                        </Link>

                        <div className="flex items-center gap-2 md:gap-4">
                            <span className="flex items-center gap-2 text-black font-black text-xs md:text-sm">
                                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">1</span>
                                <span className="hidden md:inline">Sacola</span>
                            </span>
                            <div className="w-8 h-0.5 bg-gray-200"></div>
                            <span className="flex items-center gap-2 text-gray-400 font-bold text-xs md:text-sm">
                                <span className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">2</span>
                                <span className="hidden md:inline">Identificação</span>
                            </span>
                            <div className="w-8 h-0.5 bg-gray-200"></div>
                            <span className="flex items-center gap-2 text-gray-400 font-bold text-xs md:text-sm">
                                <span className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">3</span>
                                <span className="hidden md:inline">Pagamento</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
                <h1 className="text-3xl font-black text-gray-900 mb-8">Itens na Sacola ({items.length})</h1>

                <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start">

                    {/* --- LISTA DE PRODUTOS --- */}
                    <div className="space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">

                                {/* Imagem */}
                                <div className="h-32 w-32 md:h-40 md:w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 p-2">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">SEM FOTO</div>
                                    )}
                                </div>

                                {/* Detalhes */}
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 pr-8">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                title="Remover item"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium mt-1">Ref: {item.id.toString().padStart(6, '0')}</p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 mt-6">

                                        {/* Controle Quantidade */}
                                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-black disabled:opacity-50 disabled:shadow-none hover:bg-gray-100 transition-all"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white shadow-sm hover:bg-neutral-800 transition-all"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>

                                        {/* Preço */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-medium mb-0.5">Total do item</p>
                                            <p className="text-2xl font-black text-gray-900 tracking-tight">{formatMoney(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- RESUMO DO PEDIDO (Sticky) --- */}
                    <div className="sticky top-28 space-y-6">

                        <div className="rounded-[32px] bg-white border border-gray-100 shadow-xl p-8">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" /> Resumo
                            </h2>

                            {/* REMOVIDO: Input de Cupom */}

                            {/* Totais */}
                            <div className="space-y-3 pb-6 border-b border-gray-100">
                                <div className="flex justify-between text-sm text-gray-600 font-medium">
                                    <span>Subtotal ({items.length} itens)</span>
                                    <span>{formatMoney(total)}</span>
                                </div>
                                {/* Desconto removido visualmente pois será aplicado no Checkout */}
                            </div>

                            {/* Calculadora de Frete */}
                            <div className="py-6 border-b border-gray-100">
                                <ShippingCalculator />
                            </div>

                            <div className="pt-6">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm font-bold text-gray-500">Total à vista</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tight">{formatMoney(total)}</span>
                                </div>
                                <p className="text-xs text-right text-gray-400 font-medium mb-6">
                                    ou em até 10x de {formatMoney(total / 10)} sem juros
                                </p>

                                <Link
                                    href="/checkout"
                                    className="group w-full rounded-full bg-green-600 py-5 font-black text-white text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-600/20 hover:shadow-2xl hover:-translate-y-1"
                                >
                                    Ir para Pagamento <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Benefícios */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <p className="text-xs font-bold text-gray-600 leading-tight">Compra 100% Segura</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                                    <ShoppingBag className="h-4 w-4" />
                                </div>
                                <p className="text-xs font-bold text-gray-600 leading-tight">Garantia na Entrega</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}