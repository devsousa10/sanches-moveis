"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Check, CreditCard, Heart, Loader2 } from "lucide-react";
import { toggleWishlist } from "@/actions/wishlist";
import { useRouter } from "next/navigation";

interface Variant {
    id: number;
    colorName: string;
    colorValue: string;
    stock: number;
    images: string[];
}

interface ProductOptionsProps {
    product: any;
    onImageChange?: (url: string) => void;
    initialIsLiked: boolean;
}

export function ProductOptions({ product, onImageChange, initialIsLiked }: ProductOptionsProps) {
    const { addToCart } = useCart();
    const router = useRouter();
    const hasVariants = product.variants && product.variants.length > 0;

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        hasVariants ? product.variants[0] : null
    );
    const [quantity, setQuantity] = useState(1);

    // Estado do Wishlist
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    useEffect(() => {
        if (selectedVariant && selectedVariant.images.length > 0 && onImageChange) {
            onImageChange(selectedVariant.images[0]);
        }
    }, [selectedVariant, onImageChange]);

    const price = Number(product.price);
    const discount = product.discountPercent || 0;
    const finalPrice = discount > 0 ? price - (price * (discount / 100)) : price;
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

    const formatMoney = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

    const handleWishlistToggle = async () => {
        setIsWishlistLoading(true);

        // Optimistic UI (muda visualmente antes de confirmar)
        const previousState = isLiked;
        setIsLiked(!previousState);

        try {
            const result = await toggleWishlist(product.id);

            if (result?.error === "UNAUTHORIZED") {
                // Se não logado, reverte e manda pro login
                setIsLiked(previousState);
                router.push(`/login?callbackUrl=/produto/${product.slug}`);
                return;
            }

            if (result?.error) {
                setIsLiked(previousState);
                alert("Erro ao favoritar.");
            }
        } catch (error) {
            setIsLiked(previousState);
        } finally {
            setIsWishlistLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (hasVariants && !selectedVariant) {
            alert("Por favor, selecione uma cor.");
            return;
        }
        if (currentStock < quantity) {
            alert("Estoque insuficiente.");
            return;
        }

        addToCart({
            id: product.id,
            name: selectedVariant ? `${product.name} - ${selectedVariant.colorName}` : product.name,
            price: Number(product.price),
            image: (selectedVariant && selectedVariant.images.length > 0) ? selectedVariant.images[0] : product.images[0],
            quantity: quantity
        });
        alert("Adicionado ao carrinho!");
    };

    return (
        <div className="space-y-8">
            {/* Preço de Destaque */}
            <div>
                <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-gray-900 tracking-tight">
                        {formatMoney(finalPrice)}
                    </span>
                    {discount > 0 && (
                        <span className="text-xl text-gray-400 line-through font-medium">
                            {formatMoney(price)}
                        </span>
                    )}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                        12x de {formatMoney(finalPrice / 12)} sem juros
                    </span>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Seleção de Variantes */}
            {hasVariants && (
                <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                        Acabamento: <span className="text-gray-500 normal-case">{selectedVariant?.colorName}</span>
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {product.variants.map((variant: Variant) => {
                            const isSelected = selectedVariant?.id === variant.id;
                            const isOutOfStock = variant.stock === 0;
                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                                    disabled={isOutOfStock}
                                    className={`
                                        h-12 w-12 rounded-full border flex items-center justify-center transition-all
                                        ${isSelected ? "border-black ring-1 ring-black scale-110" : "border-gray-200 hover:border-gray-400"}
                                        ${isOutOfStock ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                    title={variant.colorName}
                                >
                                    <div
                                        className="h-9 w-9 rounded-full shadow-inner border border-black/10"
                                        style={{ backgroundColor: variant.colorValue }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-2">
                <button
                    onClick={handleAddToCart}
                    disabled={currentStock === 0}
                    className={`
                        flex-1 h-14 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:-translate-y-1
                        ${currentStock > 0 ? "bg-black text-white hover:bg-gray-900" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                    `}
                >
                    {currentStock > 0 ? (
                        <> <ShoppingBag className="h-5 w-5" /> Adicionar à Sacola </>
                    ) : "Esgotado"}
                </button>

                {/* Botão de Favoritar */}
                <button
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={`
                        h-14 w-14 rounded-full border flex items-center justify-center transition-all hover:scale-105
                        ${isLiked
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black"}
                    `}
                    title={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    {isWishlistLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
                    )}
                </button>
            </div>

            {currentStock > 0 && currentStock <= 5 && (
                <p className="text-center text-xs font-bold text-red-500 animate-pulse">
                    Restam apenas {currentStock} unidades!
                </p>
            )}
        </div>
    );
}