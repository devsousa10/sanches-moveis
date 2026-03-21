"use client";

import { useState, MouseEvent, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    selectedImage?: string;
}

export function ProductGallery({ images, selectedImage }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: "0% 0%" });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (selectedImage) {
            const idx = images.indexOf(selectedImage);
            if (idx !== -1) setSelectedIndex(idx);
        }
    }, [selectedImage, images]);

    const safeImages = images.length > 0 ? images : [];
    const mainImage = safeImages[selectedIndex];

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
    };

    if (!mainImage) {
        return <div className="aspect-[4/5] bg-gray-100 rounded-[32px] animate-pulse"></div>;
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sticky top-24">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto scrollbar-hide lg:max-h-[700px] py-2 lg:py-0 px-1">
                {safeImages.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                            "relative h-20 w-20 lg:h-24 lg:w-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white p-1",
                            selectedIndex === index
                                ? "border-black ring-2 ring-gray-100 scale-105"
                                : "border-gray-100 opacity-70 hover:opacity-100 hover:border-gray-300"
                        )}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${index}`}
                            className="w-full h-full object-contain"
                        />
                    </button>
                ))}
            </div>

            {/* Imagem Principal */}
            <div
                className="relative flex-1 aspect-[4/5] lg:aspect-square bg-white rounded-[40px] overflow-hidden group cursor-crosshair shadow-sm border border-gray-100"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Imagem Normal */}
                <img
                    src={mainImage}
                    alt="Product Main"
                    className={cn(
                        "w-full h-full object-contain transition-opacity duration-300 p-4", // p-4 para não colar nas bordas
                        isHovering ? "opacity-0" : "opacity-100"
                    )}
                />

                {/* Imagem Zoom (Background) */}
                <div
                    className={cn(
                        "absolute inset-0 bg-no-repeat transition-opacity duration-300 bg-white",
                        isHovering ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        backgroundImage: `url(${mainImage})`,
                        backgroundSize: "200%", // Zoom Level
                        backgroundOrigin: "content-box", // Respeita padding
                        padding: "20px", // Mesmo padding da imagem normal
                        ...zoomStyle
                    }}
                ></div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/5 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Zoom
                </div>
            </div>
        </div>
    );
}