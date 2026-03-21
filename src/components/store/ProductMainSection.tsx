"use client";

import { useState, useEffect } from "react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { useCart } from "@/contexts/CartContext";
import { toggleWishlist } from "@/actions/wishlist";
import {
    Heart, ShoppingBag, Truck, ShieldCheck,
    Star, ChevronDown,
    Ruler, Box, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallmentModal } from "@/components/shop/InstallmentModal";
import { InstallmentOption, getInstallmentOptions } from "@/actions/payment";

interface Variant {
    id: number;
    colorName: string;
    colorValue: string;
    stock: number;
    images: string[];
}

interface ProductMainSectionProps {
    product: any;
    isLiked: boolean;
    installmentOptions?: InstallmentOption[]; // Agora aceita as parcelas prontas
}

export function ProductMainSection({ product, isLiked: initialIsLiked, installmentOptions = [] }: ProductMainSectionProps) {
    const { addToCart } = useCart();

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants?.length > 0 ? product.variants[0] : null
    );
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // CORREÇÃO: Inicia com os dados do servidor (sem loading)
    const [installments, setInstallments] = useState<InstallmentOption[]>(installmentOptions);

    const currentPrice = Number(product.price);
    const discount = product.discountPercent || 0;
    const finalPrice = discount > 0 ? currentPrice * (1 - discount / 100) : currentPrice;

    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
    const displayImages = (selectedVariant && selectedVariant.images.length > 0)
        ? selectedVariant.images
        : product.images;

    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // CORREÇÃO: Garante o cálculo correto se o preço mudar ou se não vier do servidor
    useEffect(() => {
        // Se já temos parcelas carregadas e o preço bate, não faz nada
        if (installmentOptions.length > 0 && installments.length > 0) {
            return;
        }

        const max = product.maxInstallments ?? 12;
        const free = product.freeInstallments ?? 0;

        // Chama a Server Action passando as regras do produto
        getInstallmentOptions(finalPrice, max, free).then(setInstallments);
    }, [finalPrice, product.maxInstallments, product.freeInstallments, installmentOptions, installments.length]);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: selectedVariant ? `${product.name} - ${selectedVariant.colorName}` : product.name,
            price: finalPrice,
            image: displayImages[0],
            quantity: quantity,
            slug: product.slug,
            variantId: selectedVariant?.id
        });
    };

    const handleWishlist = async () => {
        const prev = isLiked;
        setIsLiked(!prev);
        setIsLoadingWishlist(true);
        try {
            const res = await toggleWishlist(product.id);
            if (res?.error) {
                setIsLiked(prev);
                alert("Faça login para salvar nos favoritos.");
            }
        } catch (e) {
            setIsLiked(prev);
        } finally {
            setIsLoadingWishlist(false);
        }
    };

    const ratingValue = product.ratingAverage || 5;
    const ratingCount = product.ratingCount || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">
            {/* COLUNA ESQUERDA: GALERIA */}
            <div className="lg:col-span-7">
                <ProductGallery
                    images={displayImages}
                    selectedImage={selectedVariant?.images[0]}
                />
            </div>

            {/* COLUNA DIREITA: INFO & AÇÃO */}
            <div className="lg:col-span-5 flex flex-col pt-4">
                {/* Header do Produto */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                            {product.categoryName}
                        </span>
                        {product.featured && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                                <Star className="h-3 w-3 fill-current" /> Destaque
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-4">
                        {product.name}
                    </h1>

                    <a href="#reviews" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors w-fit">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={cn("h-4 w-4", i <= Math.round(ratingValue) ? "fill-current" : "text-gray-200 fill-gray-200")} />
                            ))}
                        </div>
                        <span>({ratingValue.toFixed(1)}) • {ratingCount} avaliações</span>
                    </a>
                </div>

                {/* Preço e Parcelamento */}
                <div className="mb-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex flex-col">
                        {discount > 0 && (
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg text-gray-400 line-through font-medium">
                                    {formatMoney(currentPrice)}
                                </span>
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-md">
                                    -{discount}% OFF
                                </span>
                            </div>
                        )}
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900 tracking-tight">
                                {formatMoney(finalPrice)}
                            </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                {installments.length > 0 ? (
                                    <>
                                        {/* Mostra a melhor opção disponível */}
                                        {(() => {
                                            const bestOption = installments[installments.length - 1];
                                            const isFree = bestOption.installment_rate === 0;
                                            return (
                                                <span>
                                                    Até <strong>{bestOption.installments}x</strong> de <strong>{bestOption.installment_amount_formatted}</strong>
                                                    {isFree && <span className="text-green-600 font-bold ml-1">sem juros</span>}
                                                </span>
                                            );
                                        })()}
                                    </>
                                ) : (
                                    "Calculando parcelas..."
                                )}
                            </p>

                            {/* Botão Ver Parcelas */}
                            {installments.length > 0 && <InstallmentModal options={installments} />}
                        </div>
                    </div>
                </div>

                {/* Variantes */}
                {product.variants && product.variants.length > 0 && (
                    <div className="mb-8">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">
                            Acabamento: <span className="text-gray-500">{selectedVariant?.colorName}</span>
                        </span>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant: Variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={cn(
                                        "group relative h-14 w-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-sm",
                                        selectedVariant?.id === variant.id
                                            ? "border-black scale-110"
                                            : "border-gray-200 hover:border-gray-400"
                                    )}
                                    title={variant.colorName}
                                >
                                    <span
                                        className="h-10 w-10 rounded-full border border-black/5 shadow-inner block"
                                        style={{ backgroundColor: variant.colorValue }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={handleAddToCart}
                        disabled={currentStock === 0}
                        className={cn(
                            "flex-1 h-16 rounded-full font-black text-lg tracking-wide shadow-xl transition-all flex items-center justify-center gap-3",
                            currentStock > 0
                                ? "bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-2xl"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {currentStock > 0 ? (
                            <>
                                <ShoppingBag className="h-6 w-6" /> Comprar Agora
                            </>
                        ) : (
                            "Esgotado"
                        )}
                    </button>

                    <button
                        onClick={handleWishlist}
                        disabled={isLoadingWishlist}
                        className={cn(
                            "h-16 w-16 rounded-full border-2 flex items-center justify-center transition-all",
                            isLiked
                                ? "border-red-100 bg-red-50 text-red-500"
                                : "border-gray-200 hover:border-black hover:text-black text-gray-400"
                        )}
                    >
                        <Heart className={cn("h-7 w-7 transition-transform", isLiked && "fill-current scale-110")} />
                    </button>
                </div>

                {/* Aviso de Estoque */}
                {currentStock > 0 && currentStock <= 5 && (
                    <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                        <Truck className="h-4 w-4" /> Corra! Restam apenas {currentStock} unidades.
                    </div>
                )}

                {/* Benefícios */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900 uppercase">Entrega Rápida</p>
                            <p className="text-[10px] text-gray-500">Somente para Osasco-SP</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900 uppercase">Garantia Total</p>
                            <p className="text-[10px] text-gray-500">90 dias de proteção</p>
                        </div>
                    </div>
                </div>

                {/* Descrição e Specs */}
                <div className="space-y-4">
                    <div className="border-t border-gray-100 pt-4">
                        <details className="group" open>
                            <summary className="flex cursor-pointer items-center justify-between font-bold text-lg text-gray-900 list-none mb-3">
                                <span className="flex items-center gap-2">
                                    <Box className="h-5 w-5" /> Sobre o Produto
                                </span>
                                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180 text-gray-400" />
                            </summary>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-line pl-2">
                                {product.description}
                            </div>
                        </details>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <details className="group">
                            <summary className="flex cursor-pointer items-center justify-between font-bold text-lg text-gray-900 list-none mb-3">
                                <span className="flex items-center gap-2">
                                    <Ruler className="h-5 w-5" /> Ficha Técnica
                                </span>
                                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180 text-gray-400" />
                            </summary>

                            <div className="grid grid-cols-2 gap-3 pl-2 pb-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Altura</span>
                                    <span className="font-bold text-gray-900">{product.height} cm</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Largura</span>
                                    <span className="font-bold text-gray-900">{product.width} cm</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Profundidade</span>
                                    <span className="font-bold text-gray-900">{product.depth} cm</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Peso</span>
                                    <span className="font-bold text-gray-900">{product.weight} kg</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                    <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Material</span>
                                    <span className="font-bold text-gray-900">{product.material || "MDF de Alta Densidade Premium"}</span>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>

            </div>
        </div>
    );
}