import { getAllReviews, deleteReviewFormAction } from "@/actions/reviews";
import { MessageSquare, Star, Trash2, User, Box } from "lucide-react";
import Link from "next/link";
import { StarRating } from "@/components/shop/StarRating";

export default async function AdminReviewsPage() {
    const reviews = await getAllReviews();

    return (
        <div className="min-h-screen pb-20">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Gerenciar Avaliações
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Monitore o que os clientes estão falando.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-full border border-gray-100 font-bold shadow-sm">
                    Total: {reviews.length}
                </div>
            </div>

            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">Nenhuma avaliação encontrada.</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">

                            {/* Info Produto */}
                            <div className="w-full md:w-64 shrink-0 flex items-start gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {review.product.images[0] && (
                                        <img src={review.product.images[0]} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Produto</p>
                                    <Link href={`/produto/${review.product.slug}`} className="font-bold text-sm text-gray-900 hover:underline line-clamp-2">
                                        {review.product.name}
                                    </Link>
                                </div>
                            </div>

                            {/* Info Review */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                            <User className="h-3 w-3 text-gray-500" />
                                            <span className="text-xs font-bold text-gray-700">{review.user.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <StarRating rating={review.rating} size={4} />
                                </div>
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center pl-4 border-l border-gray-100">
                                <form action={deleteReviewFormAction}>
                                    <input type="hidden" name="id" value={review.id} />
                                    <button
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                        title="Remover Avaliação"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
