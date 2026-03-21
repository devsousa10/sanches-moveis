"use client";

import { updateProduct } from "@/actions/products";
import { ImageUpload } from "@/components/ImageUpload";
import { Save, ArrowLeft, Ruler, Box, Plus, Trash2, Palette, Smartphone, Tag, Eye, EyeOff, Timer, Zap, CreditCard, RefreshCw, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getInstallmentOptions, type InstallmentOption } from "@/actions/payment";

interface Variant {
    id?: number;
    colorName: string;
    colorValue: string;
    stock: number;
    images: string[];
}

interface ProductFormProps {
    product: any;
    categories: any[];
}

// --- COMPONENTES AUXILIARES MOVIDOS PARA FORA ---

const CustomSwitch = ({ label, icon: Icon, checked, onChange, colorClass = "peer-checked:bg-black" }: any) => (
    <label className="relative flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl cursor-pointer group hover:border-gray-300 transition-all shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${checked ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'} transition-all`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-900">{label}</span>
        </div>
        <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className={`w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer ${colorClass} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all shadow-inner`}></div>
        </div>
    </label>
);

const InputLabel = ({ icon: Icon, children }: any) => (
    <label className="block text-sm font-black text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
        {Icon && <Icon className="w-4 h-4 text-yellow-600" />} {children}
    </label>
);

const StyledInput = (props: any) => (
    <input
        {...props}
        className={`w-full p-4 bg-white rounded-xl border-2 border-gray-100 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 ${props.className}`}
    />
);

// --- COMPONENTE PRINCIPAL ---

export function ProductForm({ product, categories }: ProductFormProps) {
    const isEditing = product.id && product.id !== 0;

    // --- Estados ---
    const [name, setName] = useState(product.name || "");
    const [price, setPrice] = useState(Number(product.price) || 0);
    const [discount, setDiscount] = useState(Number(product.discountPercent) || 0);
    const [mainImages, setMainImages] = useState<string[]>(product.images || []);
    const [variants, setVariants] = useState<Variant[]>(product.variants || []);
    const [activeTab, setActiveTab] = useState<'geral' | 'cores' | 'specs'>('geral');

    // Status e Destaques
    const [isActive, setIsActive] = useState(product.isActive ?? true);
    const [featured, setFeatured] = useState(product.featured || false);

    // Configurações de Parcelamento
    const [maxInstallments, setMaxInstallments] = useState<number>(product.maxInstallments ?? 12);
    const [freeInstallments, setFreeInstallments] = useState<number>(product.freeInstallments ?? 12);

    const [simulationOptions, setSimulationOptions] = useState<InstallmentOption[]>([]);
    const [isLoadingSimulation, setIsLoadingSimulation] = useState(false);

    // Ofertas
    const [isOffer, setIsOffer] = useState(product.isOffer || false);
    const [offerExpiresAt, setOfferExpiresAt] = useState(
        product.offerExpiresAt ? new Date(product.offerExpiresAt).toISOString().slice(0, 16) : ""
    );

    // Outros
    const [description, setDescription] = useState(product.description || "");
    const [categoryId, setCategoryId] = useState(product.categoryId || (categories[0]?.id || ""));
    const [stock, setStock] = useState(product.stock || 0);
    const [width, setWidth] = useState(product.width || "");
    const [height, setHeight] = useState(product.height || "");
    const [depth, setDepth] = useState(product.depth || "");
    const [weight, setWeight] = useState(product.weight || "");

    const finalPrice = price - (price * (discount / 100));

    // --- Helpers & Effects ---
    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    useEffect(() => {
        const fetchSimulation = async () => {
            if (finalPrice <= 0) return;
            setIsLoadingSimulation(true);
            try {
                const options = await getInstallmentOptions(finalPrice);
                setSimulationOptions(options);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingSimulation(false);
            }
        };
        const timeout = setTimeout(fetchSimulation, 800);
        return () => clearTimeout(timeout);
    }, [finalPrice]);

    // --- Handlers ---
    const addVariant = () => {
        setVariants([...variants, { colorName: "Nova Cor", colorValue: "#000000", stock: 1, images: [] }]);
    };

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        if (isEditing) formData.append("id", String(product.id));
        formData.append("name", name);
        formData.append("price", String(price));
        formData.append("discountPercent", String(discount));
        formData.append("description", description);
        formData.append("categoryId", String(categoryId));
        formData.append("stock", String(stock));

        formData.append("isActive", String(isActive));
        formData.append("featured", String(featured));

        formData.append("maxInstallments", String(maxInstallments));
        formData.append("freeInstallments", String(freeInstallments));

        formData.append("isOffer", String(isOffer));
        if (offerExpiresAt) formData.append("offerExpiresAt", new Date(offerExpiresAt).toISOString());

        if (width) formData.append("width", String(width));
        if (height) formData.append("height", String(height));
        if (depth) formData.append("depth", String(depth));
        if (weight) formData.append("weight", String(weight));

        formData.append("images", JSON.stringify(mainImages));
        formData.append("variants", JSON.stringify(variants));

        await updateProduct(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-[1400px] mx-auto pt-10 px-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/produtos" className="group p-3 bg-white border border-gray-200 rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-all shadow-sm">
                            <ArrowLeft className="h-6 w-6 text-gray-500 group-hover:text-yellow-500" />
                        </Link>
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
                                {isEditing ? "Editar Produto" : "Criar Novo Produto"}
                            </h1>
                            <p className="text-gray-500 text-lg mt-2 font-medium">Estúdio de criação e gerenciamento de catálogo.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none">
                            <CustomSwitch
                                label={isActive ? "Produto Ativo" : "Rascunho (Inativo)"}
                                icon={isActive ? Eye : EyeOff}
                                checked={isActive}
                                onChange={(e: any) => setIsActive(e.target.checked)}
                                colorClass="peer-checked:bg-green-600"
                            />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ESQUERDA (8/12) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Tabs */}
                        <div className="bg-gray-900/5 p-1.5 rounded-2xl flex gap-1 relative">
                            <button type="button" onClick={() => setActiveTab('geral')} className={`flex-1 py-3 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 relative z-10 ${activeTab === 'geral' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-900'}`}>
                                <Box className="w-4 h-4" /> Informações
                            </button>
                            <button type="button" onClick={() => setActiveTab('cores')} className={`flex-1 py-3 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 relative z-10 ${activeTab === 'cores' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-900'}`}>
                                <Palette className="w-4 h-4" /> Cores
                            </button>
                            <button type="button" onClick={() => setActiveTab('specs')} className={`flex-1 py-3 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 relative z-10 ${activeTab === 'specs' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-900'}`}>
                                <Ruler className="w-4 h-4" /> Specs
                            </button>
                        </div>

                        <div className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-white p-8 lg:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

                            {/* TAB GERAL */}
                            {activeTab === 'geral' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">

                                    <div>
                                        <InputLabel icon={Tag}>Nome do Produto</InputLabel>
                                        <StyledInput
                                            value={name}
                                            onChange={(e: any) => setName(e.target.value)}
                                            className="text-2xl font-black py-6"
                                            placeholder="Ex: Sofá Retrátil Premium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <InputLabel icon={CreditCard}>Preço Original (R$)</InputLabel>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg">R$</span>
                                                <StyledInput
                                                    type="number"
                                                    step="0.01"
                                                    value={price}
                                                    onChange={(e: any) => setPrice(Number(e.target.value))}
                                                    className="pl-16 text-xl font-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel icon={Zap}>Desconto (%)</InputLabel>
                                            <div className="relative">
                                                <StyledInput
                                                    type="number"
                                                    value={discount}
                                                    onChange={(e: any) => setDiscount(Number(e.target.value))}
                                                    className="pr-16 text-xl font-black text-red-600 bg-red-50/50 border-red-100 focus:border-red-500 focus:ring-red-500/10"
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-red-400 font-black text-lg">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-8"></div>

                                    <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200/50 space-y-6 relative overflow-hidden">
                                        <div className="absolute -left-10 -bottom-10 text-neutral-200/30 pointer-events-none">
                                            <Sparkles className="w-40 h-40" />
                                        </div>

                                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 relative z-10">
                                            <Eye className="w-5 h-5 text-yellow-600" /> Visibilidade
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                            <CustomSwitch
                                                label="Destaque Home"
                                                icon={Star}
                                                checked={featured}
                                                onChange={(e: any) => setFeatured(e.target.checked)}
                                                colorClass="peer-checked:bg-yellow-500"
                                            />

                                            <CustomSwitch
                                                label="Oferta Relâmpago"
                                                icon={Timer}
                                                checked={isOffer}
                                                onChange={(e: any) => setIsOffer(e.target.checked)}
                                                colorClass="peer-checked:bg-red-600"
                                            />
                                        </div>

                                        {isOffer && (
                                            <div className="animate-in slide-in-from-top-4 fade-in duration-300 pt-4 relative z-10">
                                                <InputLabel icon={Timer}>Expira em:</InputLabel>
                                                <StyledInput
                                                    type="datetime-local"
                                                    value={offerExpiresAt}
                                                    onChange={(e: any) => setOfferExpiresAt(e.target.value)}
                                                    className="bg-white font-bold"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100/50 relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 text-blue-200/30 pointer-events-none">
                                            <CreditCard className="w-40 h-40 -rotate-12" />
                                        </div>

                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-blue-600" /> Regras de Parcelamento
                                            </h3>
                                            <span className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold tracking-wide shadow-sm flex items-center gap-1">
                                                <RefreshCw className="w-3 h-3" /> Mercado Pago
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
                                            <div>
                                                <InputLabel>Máx. Parcelas</InputLabel>
                                                <select
                                                    value={maxInstallments}
                                                    onChange={(e) => setMaxInstallments(Number(e.target.value))}
                                                    className="w-full p-4 bg-white border-2 border-blue-100 rounded-xl font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                                >
                                                    {[...Array(12)].map((_, i) => (
                                                        <option key={i} value={i + 1}>{i + 1}x</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <InputLabel><span className="text-green-600">Sem Juros</span> (Até)</InputLabel>
                                                <select
                                                    value={freeInstallments}
                                                    onChange={(e) => setFreeInstallments(Number(e.target.value))}
                                                    className="w-full p-4 bg-white border-2 border-green-100 rounded-xl font-bold focus:border-green-500 outline-none appearance-none cursor-pointer text-green-700"
                                                >
                                                    <option value={0}>Nenhuma</option>
                                                    {[...Array(12)].map((_, i) => (
                                                        <option key={i} value={i + 1}>{i + 1}x Sem Juros</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 relative z-10">
                                            <p className="text-xs font-black text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-wider">
                                                Vista do Cliente
                                                {isLoadingSimulation && <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />}
                                            </p>

                                            <div className="max-h-64 overflow-y-auto pr-4 space-y-3 custom-scrollbar">
                                                {simulationOptions.length > 0 ? simulationOptions.slice(0, maxInstallments).map((opt, i) => {
                                                    const isFreeRule = opt.installments <= freeInstallments;
                                                    let displayInstallment = opt.installment_amount_formatted;
                                                    let isFreeDisplay = opt.installment_rate === 0;

                                                    if (isFreeRule) {
                                                        displayInstallment = formatMoney(finalPrice / opt.installments);
                                                        isFreeDisplay = true;
                                                    }

                                                    return (
                                                        <div key={opt.installments} className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${isFreeDisplay ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-100'} ${i === maxInstallments - 1 ? 'shadow-md border-blue-200 bg-blue-50/30' : ''}`}>
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 font-black text-sm">{opt.installments}x</span>
                                                                <span className="font-bold text-gray-900 text-lg">
                                                                    {displayInstallment}
                                                                </span>
                                                            </div>
                                                            {isFreeDisplay ? (
                                                                <span className="text-[10px] font-black bg-green-500 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-green-200">SEM JUROS</span>
                                                            ) : (
                                                                <span className="text-xs font-bold text-gray-400">Total: {opt.total_amount_formatted}</span>
                                                            )}
                                                        </div>
                                                    )
                                                }) : (
                                                    <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-3">
                                                        <CreditCard className="w-10 h-10 text-gray-200" />
                                                        <p>Digite um preço para gerar a simulação.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <InputLabel icon={Box}>Categoria</InputLabel>
                                            <div className="flex flex-col gap-3">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => setCategoryId(cat.id)}
                                                        className={`p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between group ${Number(categoryId) === cat.id ? 'border-black bg-black text-white shadow-lg' : 'border-gray-100 bg-white text-gray-500 hover:border-yellow-500 hover:text-yellow-600'}`}
                                                    >
                                                        {cat.name}
                                                        <div className={`w-4 h-4 rounded-full border-2 ${Number(categoryId) === cat.id ? 'border-white bg-yellow-500' : 'border-gray-300 group-hover:border-yellow-500'}`}></div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <InputLabel icon={Box}>Descrição</InputLabel>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={8}
                                                className="w-full p-6 bg-white rounded-xl border-2 border-gray-100 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 resize-none leading-relaxed"
                                                placeholder="Descreva os detalhes..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB CORES & IMAGENS */}
                            {activeTab === 'cores' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
                                    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm">
                                        <InputLabel icon={Tag}>Imagens Principais</InputLabel>
                                        <ImageUpload
                                            value={mainImages}
                                            onChange={(urls: any) => setMainImages(urls)}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                                <Palette className="w-6 h-6 text-yellow-500" /> Variações
                                            </h3>
                                            <button type="button" onClick={addVariant} className="group flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Adicionar Cor
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {variants.map((variant, index) => (
                                                <div key={index} className="bg-white p-8 rounded-[32px] border-2 border-gray-100 shadow-md relative group/variant hover:border-yellow-500/30 transition-all">
                                                    <button type="button" onClick={() => removeVariant(index)} className="absolute top-6 right-6 p-3 bg-red-50 text-red-500 rounded-full opacity-0 group-hover/variant:opacity-100 hover:bg-red-100 transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                        <div className="lg:col-span-4 space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                            <div>
                                                                <InputLabel>Nome</InputLabel>
                                                                <StyledInput
                                                                    value={variant.colorName}
                                                                    onChange={(e: any) => updateVariant(index, 'colorName', e.target.value)}
                                                                    placeholder="Ex: Azul"
                                                                />
                                                            </div>
                                                            <div>
                                                                <InputLabel>Cor (Hex)</InputLabel>
                                                                <div className="flex gap-4 items-center">
                                                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-inner border-2 border-gray-200 shrink-0">
                                                                        <input
                                                                            type="color"
                                                                            value={variant.colorValue}
                                                                            onChange={(e) => updateVariant(index, 'colorValue', e.target.value)}
                                                                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                                                                        />
                                                                    </div>
                                                                    <StyledInput
                                                                        value={variant.colorValue}
                                                                        onChange={(e: any) => updateVariant(index, 'colorValue', e.target.value)}
                                                                        className="font-mono uppercase flex-1"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <InputLabel icon={Box}>Estoque</InputLabel>
                                                                <StyledInput
                                                                    type="number"
                                                                    value={variant.stock}
                                                                    onChange={(e: any) => updateVariant(index, 'stock', Number(e.target.value))}
                                                                    className="font-black text-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="lg:col-span-8">
                                                            <InputLabel icon={Tag}>Fotos ({variant.colorName})</InputLabel>
                                                            <ImageUpload
                                                                value={variant.images}
                                                                onChange={(urls: any) => updateVariant(index, 'images', urls)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB SPECS */}
                            {activeTab === 'specs' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
                                    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm">
                                        <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                            <Ruler className="w-6 h-6 text-yellow-500" /> Dimensões
                                        </h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            {['Largura', 'Altura', 'Profundidade', 'Peso'].map((label, i) => {
                                                const stateMap = [width, height, depth, weight];
                                                const setterMap = [setWidth, setHeight, setDepth, setWeight];
                                                const unit = i === 3 ? 'kg' : 'cm';
                                                return (
                                                    <div key={label}>
                                                        <InputLabel>{label} ({unit})</InputLabel>
                                                        <StyledInput
                                                            type="number"
                                                            value={stateMap[i]}
                                                            onChange={(e: any) => setterMap[i](e.target.value)}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {variants.length === 0 && (
                                        <div className="bg-yellow-50 p-8 rounded-3xl border-2 border-yellow-200 shadow-sm">
                                            <InputLabel>Estoque Total</InputLabel>
                                            <StyledInput
                                                type="number"
                                                name="stock"
                                                defaultValue={product.stock}
                                                onChange={(e: any) => setStock(Number(e.target.value))}
                                                className="font-black text-2xl max-w-xs"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* DIREITA (4/12) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-6">

                            <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-white p-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                <h3 className="font-black text-2xl mb-6 flex items-center gap-2">
                                    <Tag className="w-6 h-6 text-yellow-500" /> Resumo
                                </h3>

                                <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                                        <span className="font-black text-gray-900">Final:</span>
                                        <span className="text-3xl font-black text-gray-900 tracking-tight">{formatMoney(finalPrice)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {isActive && <span className="badge bg-green-100 text-green-700 border-green-200">Ativo</span>}
                                    {featured && <span className="badge bg-yellow-100 text-yellow-700 border-yellow-200">Destaque</span>}
                                    {freeInstallments > 0 && <span className="badge bg-blue-100 text-blue-700 border-blue-200">{freeInstallments}x Sem Juros</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-yellow-500 text-black font-black text-xl py-5 rounded-2xl hover:bg-yellow-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 relative z-10"
                                >
                                    <Save className="h-6 w-6" />
                                    {isEditing ? "Salvar" : "Publicar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
                .badge { @apply px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider shadow-sm; }
            `}</style>
        </div>
    );
}