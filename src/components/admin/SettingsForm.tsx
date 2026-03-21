"use client";

import { updateSettings } from "@/actions/settings";
import { Save, Smartphone, MapPin, Truck, Store, Info } from "lucide-react";
import { useState } from "react";

interface SettingsProps {
    settings?: {
        storeName: string;
        phone: string;
        address: string;
        freeShippingMin: number;
    } | null;
}

export function SettingsForm({ settings }: SettingsProps) {
    // Estados locais para o Live Preview funcionar
    const [storeName, setStoreName] = useState(settings?.storeName || "Sanches Móveis");
    const [phone, setPhone] = useState(settings?.phone || "");
    const [address, setAddress] = useState(settings?.address || "");
    const [freeShippingMin, setFreeShippingMin] = useState(settings?.freeShippingMin || 0);

    // Formatações para o preview
    const phoneDisplay = phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Identidade da Loja <Store className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Controle como sua marca aparece para o mundo.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* --- COLUNA ESQUERDA: CONTROLES --- */}
                <div className="lg:col-span-7 space-y-8">
                    <form action={updateSettings} className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">

                        {/* Background Decorativo */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Store className="h-4 w-4" /> Dados Institucionais
                            </h3>

                            {/* Nome da Loja */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Marca</label>
                                <input
                                    type="text"
                                    name="storeName"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="w-full text-2xl font-black p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none transition-all placeholder-gray-300"
                                    placeholder="Ex: Sanches Móveis"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* WhatsApp */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp (Suporte)</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <Smartphone className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="5511999999999"
                                            className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-2xl outline-none font-mono font-bold text-lg transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium">Use formato internacional: 55 + DDD + Número</p>
                                </div>

                                {/* Frete Grátis */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mínimo p/ Frete Grátis</label>
                                    <div className="relative transition-transform group-focus-within:scale-[1.02]">
                                        <Truck className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="number"
                                            name="freeShippingMin"
                                            value={freeShippingMin}
                                            onChange={(e) => setFreeShippingMin(Number(e.target.value))}
                                            step="0.01"
                                            className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-bold text-lg transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Endereço */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Endereço (Rodapé)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                    <textarea
                                        name="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        rows={3}
                                        placeholder="Rua Exemplo, 123 - São Paulo, SP"
                                        className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-medium transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400 max-w-xs">
                                <Info className="h-4 w-4 shrink-0" />
                                <p>As alterações refletem imediatamente no site e no link de suporte.</p>
                            </div>
                            <button
                                type="submit"
                                className="bg-black text-white font-black py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Save className="h-5 w-5" />
                                SALVAR
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- COLUNA DIREITA: LIVE PREVIEW (IPHONE) --- */}
                <div className="lg:col-span-5 sticky top-8 flex flex-col items-center">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Smartphone className="h-4 w-4" /> Simulação Mobile
                    </h3>

                    {/* O MOCKUP DO IPHONE */}
                    <div className="w-[320px] h-[640px] bg-black rounded-[50px] border-[10px] border-neutral-900 shadow-2xl relative overflow-hidden ring-4 ring-gray-100">

                        {/* Ilha Dinâmica / Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30"></div>

                        {/* Status Bar Fake */}
                        <div className="absolute top-2 right-6 z-20 flex gap-1">
                            <div className="w-4 h-2.5 bg-white rounded-[2px]"></div>
                            <div className="w-0.5 h-1 bg-white"></div>
                        </div>
                        <div className="absolute top-2 left-8 z-20 text-[10px] font-bold text-white">12:30</div>

                        {/* --- TELA 1: CHAT DO WHATSAPP --- */}
                        <div className="h-full bg-[#E5DDD5] flex flex-col pt-10">

                            {/* Header WhatsApp */}
                            <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white shadow-md z-10">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#075E54] font-bold overflow-hidden border-2 border-white/20">
                                    <Store className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm leading-tight">{storeName || "Loja"}</p>
                                    <p className="text-[10px] opacity-80">online agora</p>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                                {/* Pattern de fundo do WP */}
                                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>

                                {/* Mensagem Loja */}
                                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[85%] text-xs text-gray-800 relative z-10 animate-in slide-in-from-left-2 duration-500">
                                    <p>Olá! Bem-vindo à <strong>{storeName}</strong>.</p>
                                    <p className="mt-1">Estamos aqui para ajudar você a escolher os melhores móveis.</p>
                                    <span className="text-[9px] text-gray-400 block text-right mt-1">12:30</span>
                                </div>

                                {/* Mensagem Cliente (Exemplo) */}
                                <div className="bg-[#DCF8C6] p-3 rounded-xl rounded-tr-none shadow-sm max-w-[85%] ml-auto text-xs text-gray-800 relative z-10 animate-in slide-in-from-right-2 duration-700 delay-150">
                                    <p>Oi! Vi o site e tenho dúvida sobre a entrega.</p>
                                    <span className="text-[9px] text-gray-500 block text-right mt-1">12:31</span>
                                </div>
                            </div>

                            {/* --- BANNER DE FRETE (SIMULAÇÃO SITE) --- */}
                            <div className="bg-white p-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20">
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3"></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-2">Preview do Site</p>

                                {freeShippingMin > 0 ? (
                                    <div className="bg-black text-white p-3 rounded-xl flex items-center justify-center gap-2 animate-pulse">
                                        <Truck className="h-4 w-4 text-yellow-400" />
                                        <p className="text-xs font-bold">
                                            Frete Grátis acima de <span className="text-yellow-400">{formatMoney(freeShippingMin)}</span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 text-gray-400 p-3 rounded-xl text-center text-xs font-bold">
                                        Frete Grátis desativado
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Home Bar */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
