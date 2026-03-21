import Link from "next/link";
import { ShoppingCart, Heart, Star, Truck, ArrowRight } from "lucide-react";

interface ProductCardProps {
    product: {
        id: number;
        slug: string;
        name: string;
        price: number;
        images: string[];
        category: string;
        discountPercent?: number;
    };
}

export function ProductCard({ product }: ProductCardProps) {
    // 1. Definição da Imagem
    const mainImage = (product.images && product.images.length > 0)
        ? product.images[0]
        : "https://via.placeholder.com/400x400?text=Sanches+Moveis";

    // 2. Lógica de Desconto e Preço
    const discountPercent = product.discountPercent || 0;
    const hasDiscount = discountPercent > 0;
    const price = Number(product.price);
    const finalPrice = hasDiscount
        ? price * ((100 - discountPercent) / 100)
        : price;

    // 3. Parcelamento
    const maxInstallments = 12;
    const installmentValue = finalPrice / maxInstallments;

    // Formatação
    const formatMoney = (val: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

    return (
        <div className="group bg-white rounded-[20px] border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 flex flex-col h-full relative">

            {/* --- TOPO: IMAGEM & BADGES --- */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">

                {/* Badges de Status */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {hasDiscount ? (
                        <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded shadow-sm">
                            {discountPercent}% OFF
                        </span>
                    ) : (
                        <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                            NOVO
                        </span>
                    )}
                    {/* Badge Extra para preencher informação */}
                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded shadow-sm text-gray-700 flex items-center gap-1">
                        <Truck className="h-3 w-3" /> Pronta Entrega
                    </span>
                </div>

                {/* Botão Wishlist */}
                <button className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                    <Heart className="h-5 w-5" />
                </button>

                <Link href={`/produto/${product.slug}`} className="block h-full w-full">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay Escuro no Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </Link>
            </div>

            {/* --- CORPO: INFORMAÇÕES --- */}
            <div className="p-5 flex flex-col flex-1">

                {/* Categoria e Avaliação */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-yellow-400">
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs text-gray-400 font-medium ml-1">(4.9)</span>
                    </div>
                </div>

                {/* Título */}
                <Link href={`/produto/${product.slug}`} className="block mb-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                    </h3>
                </Link>

                {/* Bloco de Preço (Cinza para destaque) */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100 group-hover:border-yellow-200 transition-colors">
                    {hasDiscount && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 line-through">
                                De {formatMoney(price)}
                            </span>
                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded font-bold">
                                -{formatMoney(price - finalPrice)}
                            </span>
                        </div>
                    )}

                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                            {formatMoney(finalPrice)}
                        </span>
                        <span className="text-xs font-bold text-green-600 mb-0.5">à vista</span>
                    </div>

                    <p className="text-xs text-gray-500 font-medium">
                        ou <span className="text-black font-bold">{maxInstallments}x</span> de <span className="text-black font-bold">{formatMoney(installmentValue)}</span> sem juros
                    </p>
                </div>

                {/* Botão de Ação (Sempre visível agora) */}
                <div className="mt-auto">
                    <Link
                        href={`/produto/${product.slug}`}
                        className="w-full group/btn relative overflow-hidden bg-black text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:bg-neutral-800 hover:shadow-xl active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Ver Detalhes <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                        {/* Efeito de brilho no botão */}
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
                    </Link>
                </div>
            </div>
        </div>
    );
}