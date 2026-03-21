"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowUpDown, SlidersHorizontal, X, Check } from "lucide-react";

export function CategoryControlBar({ totalProducts }: { totalProducts: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Estado para abrir/fechar o menu de filtros
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Estados dos campos
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

    // Atualiza a URL quando muda a Ordenação
    const handleSortChange = (value: string) => {
        setSort(value);
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        router.push(`${pathname}?${params.toString()}`);
    };

    // Aplica os Filtros de Preço
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) params.set("min", minPrice);
        else params.delete("min");

        if (maxPrice) params.set("max", maxPrice);
        else params.delete("max");

        router.push(`${pathname}?${params.toString()}`);
        setIsFilterOpen(false);
    };

    // Limpa os filtros
    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("min");
        params.delete("max");
        router.push(`${pathname}?${params.toString()}`);
        setIsFilterOpen(false);
    };

    return (
        <div className="relative">
            {/* BARRA DE CONTROLE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">

                <span className="text-sm text-gray-500 font-medium">
                    Mostrando <strong>{totalProducts}</strong> produtos
                </span>

                <div className="flex items-center gap-2">
                    {/* ORDENAÇÃO */}
                    <div className="relative group">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm font-bold text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 cursor-pointer appearance-none outline-none transition-all"
                        >
                            <option value="newest">Lançamentos</option>
                            <option value="price_asc">Menor Preço</option>
                            <option value="price_desc">Maior Preço</option>
                            <option value="name_asc">Nome (A-Z)</option>
                        </select>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-2" />

                    {/* BOTÃO FILTRAR */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${isFilterOpen ? 'bg-black text-white' : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtrar
                    </button>
                </div>
            </div>

            {/* PAINEL DE FILTROS (EXPANSÍVEL) */}
            {isFilterOpen && (
                <div className="bg-gray-50 border-b border-gray-200 p-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex flex-col md:flex-row gap-8 items-end">

                            {/* Faixa de Preço */}
                            <div className="flex-1 w-full">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Faixa de Preço (R$)</h4>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="Mínimo"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Máximo"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
                                >
                                    Limpar
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-yellow-500 text-black rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-sm"
                                >
                                    <Check className="h-4 w-4" />
                                    Aplicar Filtros
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}