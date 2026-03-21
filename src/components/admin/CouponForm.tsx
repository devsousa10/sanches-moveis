"use client";

import { createCouponFormAction, updateCouponFormAction } from "@/actions/coupons";
import { Save, ArrowLeft, TicketPercent, Calendar, Hash, Layers, Sparkles, AlertCircle, Copy, Check, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CouponFormProps {
    coupon?: {
        id: number;
        code: string;
        discount: number;
        type: string;
        isActive: boolean;
        expiresAt: Date | null;
        maxUses: number | null;
        categoryId: number | null;
    };
    categories: { id: number; name: string }[];
}

export function CouponForm({ coupon, categories }: CouponFormProps) {
    const isEditing = !!coupon;
    const action = isEditing ? updateCouponFormAction : createCouponFormAction;

    // --- ESTADOS PARA O LIVE PREVIEW ---
    // Precisamos controlar o estado localmente para o "Live Preview" funcionar
    const [formData, setFormData] = useState({
        code: coupon?.code || "",
        discount: coupon?.discount || 0,
        type: coupon?.type || "PERCENT",
        categoryId: coupon?.categoryId || "",
        expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : "",
        maxUses: coupon?.maxUses || "",
        isActive: coupon ? coupon.isActive : true
    });

    // Atualiza o estado conforme digita
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Dados derivados para o Preview
    const categoryName = categories.find(c => c.id === Number(formData.categoryId))?.name;
    const isExpired = formData.expiresAt && new Date(formData.expiresAt) < new Date();
    // Simulação visual de status no preview
    const previewStatus = !formData.isActive ? "INATIVO" : isExpired ? "EXPIRADO" : "ATIVO";
    const previewTheme = formData.isActive
        ? "bg-neutral-900 text-white shadow-2xl shadow-yellow-900/20 border-neutral-800"
        : "bg-gray-100 text-gray-400 border-gray-300 grayscale opacity-70";

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/cupons" className="group p-3 bg-white border border-gray-200 rounded-full hover:bg-black hover:border-black hover:text-white transition-all">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        {isEditing ? "Editar Cupom" : "Criar Novo Cupom"}
                        <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    </h1>
                    <p className="text-gray-500">Configure as regras e veja o resultado em tempo real.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* --- COLUNA ESQUERDA: O PAINEL DE CONTROLE (FORM) --- */}
                <div className="lg:col-span-7 space-y-6">
                    <form action={action} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">

                        {/* Efeito decorativo de fundo */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                        {isEditing && <input type="hidden" name="id" value={coupon.id} />}

                        {/* SEÇÃO 1: O CUPOM */}
                        <div className="space-y-6 mb-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <TicketPercent className="h-4 w-4" /> Configuração Principal
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Código */}
                                <div className="md:col-span-2 group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Código Promocional</label>
                                    <div className="relative transition-all group-focus-within:scale-[1.01]">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-bold">#</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={e => handleChange('code', e.target.value.toUpperCase())}
                                            placeholder="EX: VERAO2026"
                                            className="w-full pl-8 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-mono text-lg font-bold uppercase tracking-widest transition-all shadow-inner"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Desconto */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Valor do Desconto</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={e => handleChange('discount', e.target.value)}
                                        step="0.01"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold text-lg transition-all shadow-inner"
                                        required
                                    />
                                </div>

                                {/* Tipo */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Desconto</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => handleChange('type', 'PERCENT')}
                                            className={`py-3 rounded-lg text-sm font-bold transition-all ${formData.type === 'PERCENT' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'}`}
                                        >
                                            % Porcentagem
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChange('type', 'FIXED')}
                                            className={`py-3 rounded-lg text-sm font-bold transition-all ${formData.type === 'FIXED' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'}`}
                                        >
                                            R$ Fixo
                                        </button>
                                        {/* Input Hidden para enviar no form nativo */}
                                        <input type="hidden" name="type" value={formData.type} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 2: REGRAS */}
                        <div className="space-y-6 mb-8 pt-8 border-t border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Layers className="h-4 w-4" /> Regras de Aplicação
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Categoria */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Restrição de Categoria</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={e => handleChange('categoryId', e.target.value)}
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="">✨ Válido para toda a loja</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>📦 Apenas em: {cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Validade */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Data de Validade</label>
                                    <div className="relative">
                                        <Calendar className="absolute top-4 left-4 h-5 w-5 text-gray-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            name="expiresAt"
                                            value={formData.expiresAt}
                                            onChange={e => handleChange('expiresAt', e.target.value)}
                                            className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Limite */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Limite de Usos</label>
                                    <div className="relative">
                                        <Hash className="absolute top-4 left-4 h-5 w-5 text-gray-400 pointer-events-none" />
                                        <input
                                            type="number"
                                            name="maxUses"
                                            value={formData.maxUses}
                                            onChange={e => handleChange('maxUses', e.target.value)}
                                            placeholder="Ilimitado"
                                            className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 3: STATUS & SALVAR */}
                        <div className="pt-8 border-t border-gray-100 flex items-center justify-between gap-6">

                            {/* Toggle Switch Personalizado */}
                            <div className="flex items-center gap-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={e => handleChange('isActive', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
                                    <span className="ml-3 text-sm font-bold text-gray-900">
                                        {formData.isActive ? "Cupom Ativo" : "Cupom Inativo"}
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-black py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="h-5 w-5" />
                                {isEditing ? "SALVAR ALTERAÇÕES" : "CRIAR TICKET"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- COLUNA DIREITA: LIVE PREVIEW --- */}
                <div className="lg:col-span-5 sticky top-8">
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                            Visualização em Tempo Real
                        </h3>

                        {/* O TICKET DOURADO (Mesmo componente da lista) */}
                        <div className="transform scale-105 transition-all duration-500">
                            <div className={`relative ${previewTheme} rounded-3xl overflow-hidden transition-all duration-500`}>

                                {/* Recortes */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#f3f4f6] z-10"></div>
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#f3f4f6] z-10"></div>
                                <div className="absolute top-1/2 left-6 right-6 border-t-2 border-dashed border-current opacity-20 pointer-events-none"></div>

                                {/* Parte Superior */}
                                <div className="p-8 pb-10 text-center relative">
                                    {/* Efeito Glow */}
                                    {formData.isActive && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full"></div>
                                    )}

                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${formData.isActive ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-500'}`}>
                                        {previewStatus}
                                    </div>

                                    <div className={`text-6xl font-black tracking-tighter ${formData.isActive ? 'text-yellow-400' : 'text-gray-400'}`}>
                                        {formData.type === 'PERCENT' ? (
                                            <span>{formData.discount || 0}%<small className="text-2xl text-white/50 ml-1">OFF</small></span>
                                        ) : (
                                            <span><small className="text-2xl align-top mr-1">R$</small>{formData.discount || 0}</span>
                                        )}
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] mt-2 opacity-50">
                                        Voucher Promocional
                                    </p>
                                </div>

                                {/* Parte Inferior */}
                                <div className={`p-8 pt-10 ${formData.isActive ? 'bg-white/5' : 'bg-gray-50'}`}>

                                    <div className="bg-black/20 rounded-xl p-4 flex justify-between items-center mb-6 border border-white/10 backdrop-blur-sm">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold mb-1">CÓDIGO</span>
                                            <span className="font-mono text-2xl font-bold tracking-[0.15em] text-white">
                                                {formData.code || "SEU CODIGO"}
                                            </span>
                                        </div>
                                        <Copy className="h-6 w-6 opacity-40" />
                                    </div>

                                    <div className="space-y-4 text-sm font-medium opacity-80">
                                        <div className="flex items-center gap-3">
                                            <Layers className="h-4 w-4" />
                                            <span>{categoryName ? `Apenas em ${categoryName}` : "Válido em toda a loja"}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formData.expiresAt ? `Vence em ${new Date(formData.expiresAt).toLocaleDateString('pt-BR')}` : "Sem validade definida"}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Hash className="h-4 w-4" />
                                            <span>{formData.maxUses ? `Limitado aos primeiros ${formData.maxUses}` : "Uso ilimitado"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card de Dicas */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6 flex gap-3 text-sm text-blue-800">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>
                                <strong>Dica Pro:</strong> Cupons com tempo limitado (ex: 24h) ou quantidade escassa (ex: 50 primeiros) costumam converter 3x mais.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
