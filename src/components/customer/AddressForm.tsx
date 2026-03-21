"use client";

import { createAddress, updateAddress } from "@/actions/addresses";
import { MapPin, Save, ArrowLeft, Search, Loader2, Package, Truck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface AddressFormProps {
    address?: {
        id: number;
        name: string;
        recipient: string;
        cep: string;
        street: string;
        number: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
    };
}

export function AddressForm({ address }: AddressFormProps) {
    const isEditing = !!address;
    const action = isEditing ? updateAddress : createAddress;

    const [cep, setCep] = useState(address?.cep || "");
    const [loadingCep, setLoadingCep] = useState(false);

    const [addressData, setAddressData] = useState({
        name: address?.name || "",
        recipient: address?.recipient || "",
        street: address?.street || "",
        neighborhood: address?.neighborhood || "",
        city: address?.city || "",
        state: address?.state || "",
        complement: address?.complement || "",
        number: address?.number || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, "$1-$2");

        setCep(val);

        if (val.replace("-", "").length === 8) {
            setLoadingCep(true);
            try {
                const cleanCep = val.replace("-", "");
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();

                if (data.erro) {
                    toast.error("CEP não encontrado.");
                } else {
                    setAddressData((prev) => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    }));
                    toast.success("Endereço localizado!");
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
                toast.error("Erro ao buscar CEP.");
            } finally {
                setLoadingCep(false);
            }
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/minha-conta/enderecos" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        {isEditing ? "Editar Local" : "Novo Local"} <MapPin className="h-6 w-6 text-black" />
                    </h1>
                    <p className="text-gray-500">Defina onde receberá seus produtos exclusivos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* --- COLUNA ESQUERDA: FORMULÁRIO --- */}
                <div className="lg:col-span-7">
                    <form action={action} className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">

                        {/* Decorativo */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

                        {isEditing && <input type="hidden" name="id" value={address.id} />}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

                            {/* Identificação */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Apelido do Local</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={addressData.name}
                                        onChange={handleChange}
                                        placeholder="Ex: Casa de Praia, Escritório"
                                        className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-bold text-lg transition-all placeholder-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Destinatário */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quem recebe?</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        name="recipient"
                                        value={addressData.recipient}
                                        onChange={handleChange}
                                        placeholder="Nome do responsável"
                                        className="w-full pl-12 p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-medium transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* CEP */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CEP (Busca Automática)</label>
                                <div className="relative group">
                                    <div className="absolute right-4 top-4 h-5 w-5 text-gray-400 flex items-center justify-center">
                                        {loadingCep ? <Loader2 className="animate-spin h-5 w-5 text-black" /> : <Search className="h-5 w-5" />}
                                    </div>
                                    <input
                                        type="text"
                                        name="cep"
                                        value={cep}
                                        onChange={handleCepChange}
                                        maxLength={9}
                                        placeholder="00000-000"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-mono font-bold text-xl tracking-widest transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Rua */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rua / Avenida</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={addressData.street}
                                    onChange={handleChange}
                                    placeholder="Endereço principal"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-medium transition-all"
                                    required
                                />
                            </div>

                            {/* Número e Comp */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Número</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={addressData.number}
                                    onChange={handleChange}
                                    placeholder="123"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-medium transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Complemento</label>
                                <input
                                    type="text"
                                    name="complement"
                                    value={addressData.complement}
                                    onChange={handleChange}
                                    placeholder="Apto 101"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-medium transition-all"
                                />
                            </div>

                            {/* Bairro e Cidade */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bairro</label>
                                <input
                                    type="text"
                                    name="neighborhood"
                                    value={addressData.neighborhood}
                                    onChange={handleChange}
                                    placeholder="Bairro"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-medium transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cidade - UF</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="city"
                                        value={addressData.city}
                                        onChange={handleChange}
                                        placeholder="Cidade"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl outline-none font-medium transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        value={addressData.state}
                                        onChange={handleChange}
                                        placeholder="UF"
                                        maxLength={2}
                                        className="w-20 text-center p-4 bg-gray-100 border-2 border-transparent rounded-2xl outline-none font-bold uppercase transition-all text-gray-500"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                                <Save className="h-5 w-5" />
                                {isEditing ? "Atualizar Destino" : "Salvar Destino"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- COLUNA DIREITA: LIVE PREVIEW (SHIPPING TAG) --- */}
                <div className="lg:col-span-5 sticky top-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">
                        Preview de Entrega
                    </h3>

                    {/* SHIPPING TAG CARD */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative max-w-sm mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500">

                        {/* Faixa Superior "Priority Mail" */}
                        <div className="bg-neutral-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
                            {/* Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                            <div className="flex items-center gap-3 z-10">
                                <div className="h-10 w-10 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Método de Envio</p>
                                    <p className="font-black text-lg">SANCHES EXPRESS</p>
                                </div>
                            </div>
                            <Package className="h-8 w-8 text-neutral-700" />
                        </div>

                        {/* Corpo da Etiqueta */}
                        <div className="p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">

                            {/* Destinatário */}
                            <div className="border-b-2 border-dashed border-gray-200 pb-6">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Entregar Para</p>
                                <h2 className="text-2xl font-black text-gray-900 break-words leading-tight">
                                    {addressData.recipient || "Seu Nome Aqui"}
                                </h2>
                                <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {addressData.name || "Apelido do Local"}
                                </p>
                            </div>

                            {/* Endereço Principal */}
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Endereço de Destino</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {addressData.street || "Rua Exemplo"}, {addressData.number || "000"}
                                </p>
                                <p className="text-md text-gray-600">
                                    {addressData.complement && `${addressData.complement}, `}
                                    {addressData.neighborhood || "Bairro"}
                                </p>
                                <p className="text-md text-gray-900 font-bold">
                                    {addressData.city || "Cidade"} - {addressData.state || "UF"}
                                </p>
                            </div>

                            {/* Código de Barras Fake e CEP */}
                            <div className="pt-6 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Código Postal (CEP)</p>
                                    <p className="font-mono text-2xl font-black text-black tracking-widest">
                                        {cep || "00000-000"}
                                    </p>
                                </div>
                                {/* Barcode Visual */}
                                <div className="h-12 w-24 bg-gray-800 mask-image flex items-end gap-0.5 opacity-80">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className={`bg-black h-full w-full ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer da Etiqueta */}
                        <div className="bg-yellow-400 p-3 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Priority Delivery</p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6 max-w-xs mx-auto">
                        Esta é uma simulação de como seus dados aparecerão na etiqueta de envio.
                    </p>
                </div>

            </div>
        </div>
    );
}