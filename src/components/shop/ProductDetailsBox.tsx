"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductGallery } from "./ProductGallery";
import { Minus, Plus, ShoppingBag, Truck, Info, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getInstallmentOptions, type InstallmentOption } from "@/actions/payment";
import { InstallmentModal } from "./InstallmentModal";

interface Variant {
    id: number;
    colorName: string;
    colorValue: string;
    stock: number;
    images: string[];
}

interface ProductDetailsBoxProps {
    product: any;
    initialInstallmentOptions?: InstallmentOption[]; // NOVO PROP
}

export function ProductDetailsBox({ product, initialInstallmentOptions = [] }: ProductDetailsBoxProps) {
    const { addToCart } = useCart();
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
        product.variants.length > 0 ? product.variants[0].id : null
    );
    const [quantity, setQuantity] = useState(1);

    // Inicializa com os dados do servidor se existirem
    const [installmentOptions, setInstallmentOptions] = useState<InstallmentOption[]>(initialInstallmentOptions);
    const [isLoadingInstallments, setIsLoadingInstallments] = useState(initialInstallmentOptions.length === 0);

    const activeVariant = useMemo(() =>
        product.variants.find((v: Variant) => v.id === selectedVariantId),
        [product.variants, selectedVariantId]);

    const currentPrice = Number(product.price) * (1 - product.discountPercent / 100);
    const currentStock = activeVariant ? activeVariant.stock : product.stock;
    const currentImages = (activeVariant && activeVariant.images.length > 0) ? activeVariant.images : product.images;

    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const maxInstallments = product.maxInstallments ?? 12;
    const freeInstallments = product.freeInstallments ?? 0;

    // Busca apenas se não vier do servidor ou se o preço mudar
    useEffect(() => {
        // Se já temos opções válidas para este preço (via Server), não busca
        if (initialInstallmentOptions.length > 0 && initialInstallmentOptions[0].total_amount === currentPrice) {
            setIsLoadingInstallments(false);
            return;
        }

        let isMounted = true;

        async function fetchInstallments() {
            setIsLoadingInstallments(true);
            try {
                const options = await getInstallmentOptions(currentPrice, maxInstallments, freeInstallments);
                if (isMounted) setInstallmentOptions(options);
            } catch (error) {
                console.error("Erro ao carregar parcelas", error);
            } finally {
                if (isMounted) setIsLoadingInstallments(false);
            }
        }

        fetchInstallments();

        return () => { isMounted = false; };
    }, [currentPrice, maxInstallments, freeInstallments, initialInstallmentOptions]);

    // Encontra a melhor opção para exibir em destaque
    const bestInstallment = useMemo(() => {
        if (installmentOptions.length === 0) return null;

        const noInterest = [...installmentOptions]
            .filter(opt => opt.installment_rate === 0)
            .sort((a, b) => b.installments - a.installments)[0];

        if (noInterest) return noInterest;

        return installmentOptions[installmentOptions.length - 1];
    }, [installmentOptions]);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: activeVariant ? `${product.name} - ${activeVariant.colorName}` : product.name,
            price: Number(product.price),
            image: currentImages[0],
            quantity: quantity
        });
        alert("Adicionado ao carrinho!");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* ESQUERDA: GALERIA */}
            <ProductGallery images={currentImages} />

            {/* DIREITA: INFO */}
            <div className="lg:sticky lg:top-24 space-y-8">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-xs font-bold uppercase tracking-wider rounded-full">
                            {product.category.name}
                        </span>
                        {product.discountPercent > 0 && (
                            <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full animate-pulse">
                                {product.discountPercent}% OFF
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                        {product.name}
                    </h1>
                    <div className="flex flex-col">
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-gray-900">
                                {formatMoney(currentPrice)}
                            </span>
                            {product.discountPercent > 0 && (
                                <span className="text-lg text-gray-400 line-through mb-1">
                                    {formatMoney(Number(product.price))}
                                </span>
                            )}
                        </div>

                        {/* Exibição Dinâmica das Parcelas */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CreditCard className="h-4 w-4" />
                                {isLoadingInstallments ? (
                                    <span className="animate-pulse bg-gray-200 h-4 w-32 rounded"></span>
                                ) : bestInstallment ? (
                                    <span>
                                        Em até <strong className="text-gray-900">{bestInstallment.installments}x</strong> de <strong className="text-gray-900">{bestInstallment.installment_amount_formatted}</strong>
                                        {bestInstallment.installment_rate === 0 ? <span className="text-green-600 font-bold ml-1">sem juros</span> : ""}
                                    </span>
                                ) : (
                                    <span>À vista ou no cartão</span>
                                )}
                            </div>

                            {!isLoadingInstallments && installmentOptions.length > 0 && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <InstallmentModal options={installmentOptions} />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Variantes */}
                {product.variants.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-gray-900 flex items-center justify-between">
                            Cor Selecionada: <span className="text-gray-500">{activeVariant?.colorName}</span>
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant: Variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariantId(variant.id)}
                                    className={`h-12 w-12 rounded-full border-2 p-0.5 transition-all ${selectedVariantId === variant.id ? 'border-black scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <div
                                        className="h-full w-full rounded-full border border-white/50 shadow-sm"
                                        style={{ backgroundColor: variant.colorValue }}
                                        title={variant.colorName}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ações */}
                <div className="space-y-4 py-6 border-t border-b border-gray-100">
                    {currentStock > 0 ? (
                        <div className="flex gap-4">
                            <div className="flex items-center bg-gray-50 rounded-full px-2 border border-gray-200">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-3 text-gray-500 hover:text-black transition-colors"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}
                                    className="p-3 text-gray-500 hover:text-black transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white h-14 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-900 hover:scale-[1.02] transition-all shadow-xl"
                            >
                                <ShoppingBag className="h-5 w-5" /> Adicionar à Sacola
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-100 text-gray-500 h-14 rounded-full font-bold flex items-center justify-center uppercase tracking-widest">
                            Esgotado
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2">
                        <span className="flex items-center gap-1.5">
                            <Truck className="h-4 w-4" /> Entrega somente para Osasco-SP
                        </span>
                        {currentStock > 0 && currentStock <= 5 && (
                            <span className="text-red-600 font-bold flex items-center gap-1.5 animate-pulse">
                                <Info className="h-4 w-4" /> Restam {currentStock} unidades
                            </span>
                        )}
                    </div>
                </div>

                {/* Descrição */}
                <div className="space-y-4">
                    <details className="group bg-white rounded-2xl border border-gray-100 open:shadow-md transition-all" open>
                        <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-gray-900 list-none">
                            <span>Sobre o Produto</span>
                            <span className="transition group-open:rotate-180">
                                <Plus className="h-5 w-5" />
                            </span>
                        </summary>
                        <div className="px-4 pb-4 text-gray-600 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
}