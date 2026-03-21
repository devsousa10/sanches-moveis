import { getUserReviews, deleteReviewFormAction } from "@/actions/reviews";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { StarRating } from "@/components/shop/StarRating";

export default async function MyReviewsPage() {
    const reviews = await getUserReviews();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-black" /> Minhas Avaliações
                </h1>
                <p className="text-gray-500 mt-2">Histórico de produtos que você avaliou.</p>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
                    <div className="h-20 w-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Nenhuma avaliação ainda</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Suas opiniões ajudam outros clientes a escolher melhor.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                            {/* Imagem Produto */}
                            <div className="h-24 w-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                {review.product.images[0] && (
                                    <img
                                        src={review.product.images[0]}
                                        alt={review.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Conteúdo */}
                            <div className="flex-1">
                                <Link href={`/produto/${review.product.slug}`} className="font-bold text-lg text-gray-900 hover:text-yellow-600 transition-colors">
                                    {review.product.name}
                                </Link>

                                <div className="flex items-center gap-3 mt-1 mb-3">
                                    <StarRating rating={review.rating} size={4} />
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm italic">
                                    "{review.comment}"
                                </p>
                            </div>

                            {/* Ação */}
                            <form action={deleteReviewFormAction}>
                                <input type="hidden" name="id" value={review.id} />
                                <button className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" title="Apagar avaliação">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
