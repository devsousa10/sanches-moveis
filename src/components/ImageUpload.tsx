"use client";

import { UploadButton } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-4">
                {/* CORREÇÃO: Filtramos urls vazias antes do map */}
                {value.filter((url) => url && url.length > 0).map((url) => (
                    <div key={url} className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                            src={url}
                            alt="Imagem"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={() => handleRemove(url)}
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 z-10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        const newUrls = res.map(r => r.url);
                        onChange([...value, ...newUrls]);
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERRO: ${error.message}`);
                    }}
                    appearance={{
                        button: "bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800",
                        allowedContent: "text-gray-400 text-xs"
                    }}
                    content={{
                        button: "Adicionar Fotos",
                        allowedContent: "Máx 5 fotos (4MB cada)"
                    }}
                />
            </div>
        </div>
    );
}