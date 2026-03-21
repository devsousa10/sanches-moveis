"use client";

import { saveCategory } from "@/actions/categories";
import { Save, ArrowLeft, Layers, Image as ImageIcon, Sparkles, Type, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";

interface CategoryFormProps {
    category?: {
        id: number;
        name: string;
        imageUrl?: string | null;
        description?: string | null;
        featured: boolean;
    };
}

export function CategoryForm({ category }: CategoryFormProps) {
    const isEditing = !!category;

    // Estados locais para Live Preview
    const [name, setName] = useState(category?.name || "");
    const [imageUrl, setImageUrl] = useState(category?.imageUrl || "");
    const [description, setDescription] = useState(category?.description || "");
    const [featured, setFeatured] = useState(category?.featured || false);

    return (
        <div className="min-h-screen pb-20">
            {/* HEADER */}
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/categorias" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        {isEditing ? "Editar Coleção" : "Nova Coleção"}
                        <Layers className="h-6 w-6 text-purple-600" />
                    </h1>
                    <p className="text-gray-500">Defina a identidade visual do departamento.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* --- COLUNA ESQUERDA: FORMULÁRIO --- */}
                <div className="lg:col-span-7">
                    <form action={saveCategory} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">

                        {isEditing && <input type="hidden" name="id" value={category.id} />}
                        <input type="hidden" name="imageUrl" value={imageUrl} />

                        {/* Seção Principal */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Informações Básicas
                            </h3>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Categoria</label>
                                <div className="relative group">
                                    <Type className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Sala de Estar"
                                        className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold text-lg transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Descrição Curta (SEO & Subtítulo)</label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Ex: Sofás, poltronas e racks para transformar sua sala."
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100 my-8" />

                        {/* Seção Imagem */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" /> Identidade Visual
                            </h3>

                            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black transition-colors group">
                                <ImageUpload
                                    value={imageUrl ? [imageUrl] : []}
                                    onChange={(urls) => setImageUrl(urls[0] || "")}
                                />
                                <p className="text-center text-xs text-gray-400 mt-3 group-hover:text-black transition-colors">
                                    Recomendado: 1200x800px (Horizontal) ou 800x1000px (Vertical)
                                </p>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-8" />

                        {/* Seção Switch e Salvar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <label className="flex items-center gap-4 cursor-pointer p-4 bg-gray-50 rounded-xl w-full sm:w-auto hover:bg-gray-100 transition-colors">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={featured}
                                        onChange={(e) => setFeatured(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </div>
                                <span className="font-bold text-gray-700">Destacar na Home</span>
                            </label>

                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-black text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Save className="h-5 w-5" />
                                {isEditing ? "Salvar Alterações" : "Criar Coleção"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- COLUNA DIREITA: PREVIEWS --- */}
                <div className="lg:col-span-5 space-y-8 sticky top-8">

                    {/* PREVIEW 1: CARD VISUAL */}
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                            Preview do Card
                        </h3>
                        <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl group">
                            {/* Imagem de Fundo */}
                            {imageUrl ? (
                                <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                </div>
                            )}

                            {/* Overlay Gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            {/* Conteúdo */}
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                {featured && (
                                    <span className="inline-block bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-lg">
                                        Destaque
                                    </span>
                                )}
                                <h2 className="text-4xl font-black text-white leading-tight mb-2 truncate">
                                    {name || "Nome da Coleção"}
                                </h2>
                                <p className="text-white/80 text-sm line-clamp-2">
                                    {description || "Breve descrição sobre o que o cliente encontrará nesta categoria."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PREVIEW 2: GOOGLE (SEO) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Globe className="h-3 w-3" /> Preview Google (SEO)
                        </h3>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <div className="bg-gray-200 rounded-full h-4 w-4"></div>
                                <span>sanchesmoveis.com.br › categorias</span>
                            </div>
                            <div className="text-xl text-blue-700 font-medium hover:underline cursor-pointer truncate">
                                {name ? `${name} | Sanches Móveis` : "Título da Página"}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2">
                                {description || "Compre móveis de alta qualidade com os melhores preços. Entrega rápida e garantida."}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}