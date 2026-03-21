"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
    productName: string;
    selectedImage?: string;
}

export function ProductGallery({ images, productName, selectedImage: externalImage }: ProductGalleryProps) {
    const safeImages = images.length > 0 ? images : [];
    const [internalImage, setInternalImage] = useState(safeImages[0] || null);

    useEffect(() => {
        if (externalImage) {
            setInternalImage(externalImage);
        }
    }, [externalImage]);

    if (!internalImage) {
        return (
            <div className="aspect-square w-full bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-300 animate-pulse">
                Sem Imagem
            </div>
        );
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6">
            {/* Thumbnails Minimalistas */}
            {safeImages.length > 1 && (
                <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide">
                    {safeImages.map((img, index) => (
                        <button
                            key={index}
                            onMouseEnter={() => setInternalImage(img)}
                            onClick={() => setInternalImage(img)}
                            className={`
                                relative h-20 w-20 lg:h-24 lg:w-24 flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-300
                                ${internalImage === img ? "border-black shadow-md scale-95" : "border-transparent bg-gray-50 hover:border-gray-200"}
                            `}
                        >
                            <Image
                                src={img}
                                alt={`View ${index}`}
                                fill
                                className="object-cover mix-blend-multiply"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Imagem Principal Limpa */}
            <div className="relative flex-1 aspect-square bg-white rounded-[32px] border border-gray-100 overflow-hidden group cursor-crosshair">
                <Image
                    src={internalImage}
                    alt={productName}
                    fill
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-125"
                    priority
                />
            </div>
        </div>
    );
}