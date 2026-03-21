import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
    product: any;
}

export function ProductCard({ product }: ProductCardProps) {
    const finalPrice = Number(product.price) * (1 - product.discountPercent / 100);

    // Cálculo simples para o card (sem chamar API para não pesar a Home)
    // Se tiver regra de sem juros, mostramos ela. Se não, mostramos o máximo de parcelas normal.
    const installments = product.freeInstallments > 0 ? product.freeInstallments : (product.maxInstallments ?? 12);
    const installmentValue = finalPrice / installments;
    const isFree = product.freeInstallments > 0;

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">

            {/* Wishlist Button Flutuante */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <WishlistButton productId={product.id} />
            </div>

            {/* Imagem */}
            <Link href={`/produto/${product.slug}`} className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                {product.images[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        Sem Imagem
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.discountPercent > 0 && (
                        <span className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded">
                            -{product.discountPercent}%
                        </span>
                    )}
                    {product.isOffer && (
                        <span className="px-2 py-1 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider rounded animate-pulse">
                            Oferta
                        </span>
                    )}
                </div>
            </Link>

            {/* Conteúdo */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {product.category?.name || "Geral"}
                    </span>
                    <Link href={`/produto/${product.slug}`} className="block">
                        <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-yellow-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        {product.discountPercent > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                R$ {Number(product.price).toFixed(2).replace('.', ',')}
                            </span>
                        )}
                        <span className="text-lg font-black text-gray-900">
                            R$ {finalPrice.toFixed(2).replace('.', ',')}
                        </span>

                        {/* PARCELAMENTO DINÂMICO NO CARD */}
                        <span className="text-xs text-gray-500 mt-1">
                            {installments}x de R$ {installmentValue.toFixed(2).replace('.', ',')}
                            {isFree && <span className="text-green-600 font-bold ml-1">sem juros</span>}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}