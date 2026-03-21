"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number; // 0 a 5
    size?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

export function StarRating({ rating, size = 4, interactive = false, onRate }: StarRatingProps) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && onRate?.(star)}
                    className={cn(
                        "transition-all",
                        interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
                    )}
                >
                    <Star
                        className={cn(
                            `h-${size} w-${size}`,
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-100 text-gray-200"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}