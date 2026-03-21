"use client";

import { addReview, deleteReviewFormAction } from "@/actions/reviews";
import { StarRating } from "./StarRating";
import { useState, useTransition } from "react";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: { id: number; name: string; role: string };
}

interface ReviewsSectionProps {
    productId: number;
    reviews: Review[];
    average: number;
    total: number;
    currentUserId: number | null;
}

export function ReviewsSection({ productId, reviews, average, total, currentUserId }: ReviewsSectionProps) {
    const [rating, setRating] = useState(0);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        if (rating === 0) {
            setError("Selecione uma nota de 1 a 5 estrelas.");
            return;
        }

        formData.append("rating", rating.toString());
        formData.append("productId", productId.toString());

        startTransition(async () => {
            const res = await addReview(formData);
            if (res?.error) {
                setError(res.error);
                if (res.error.includes("logado")) router.push("/login");
            } else {
                setRating(0);
                // Opcional: limpar o textarea via ref
            }
        });
    }

    return (
        <div className="mt-24 border-t border-gray-100 pt-16" id="reviews">
            <div className="grid md:grid-cols-12 gap-12">

                {/* Coluna Esquerda: Resumo */}
                <div className="md:col-span-4">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Avaliações dos Clientes</h2>

                    <div className="bg-gray-50 rounded-3xl p-8 text-center">
                        <span className="block text-6xl font-black text-gray-900 mb-2">
                            {average.toFixed(1)}
                        </span>
                        <div className="flex justify-center mb-2">
                            <StarRating rating={Math.round(average)} size={6} />
                        </div>
                        <p className="text-gray-500 font-medium">
                            Baseado em {total} avaliações
                        </p>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-bold text-gray-900 mb-4">Avalie este produto</h3>
                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Sua Nota</label>
                                <StarRating rating={rating} interactive onRate={setRating} size={8} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Seu Comentário</label>
                                <textarea
                                    name="comment"
                                    placeholder="O que você achou do produto?"
                                    className="w-full bg-gray-50 border-0 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-black transition-all font-medium"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : "Enviar Avaliação"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Coluna Direita: Lista */}
                <div className="md:col-span-8 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                            <p>Seja o primeiro a avaliar este produto!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold">
                                            {review.user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900">{review.user.name}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <StarRating rating={review.rating} size={4} />

                                        {/* Botão de Excluir (Se for dono ou admin) */}
                                        {currentUserId && (currentUserId === review.user.id || review.user.role === 'ADMIN') && (
                                            <form action={deleteReviewFormAction}>
                                                <input type="hidden" name="id" value={review.id} />
                                                <button className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Excluir avaliação">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {review.comment ?? ""}
                                </p>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
