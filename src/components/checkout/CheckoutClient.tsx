"use client";

import { useCart } from "@/contexts/CartContext";
import { validateCoupon } from "@/actions/validate-coupon";
import { createCheckout } from "@/actions/checkout";
import { login, register } from "@/actions/auth";
import { useState, useEffect } from "react";
import {
    ArrowLeft,
    ShieldCheck,
    Lock,
    Loader2,
    AlertCircle,
    Plus,
    CheckCircle,
    Package,
    Tag,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- TIPAGENS ---
interface UserAddress {
    id: number;
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
}

interface UserData {
    name: string;
    email: string;
    cpf: string | null;
    phone: string | null;
    addresses: UserAddress[];
}

interface CheckoutClientProps {
    user: UserData | null;
}

export function CheckoutClient({ user }: CheckoutClientProps) {
    const { items } = useCart();
    const router = useRouter();

    // --- ESTADOS DE CONTROLE (Auth) ---
    const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
    const [authError, setAuthError] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    // --- FORM DATA (Endereço e Pessoais) ---
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        cpf: user?.cpf || "",
        phone: user?.phone || "",
        cep: "",
        addressStreet: "",
        addressNumber: "",
        addressNeighborhood: "",
        addressCity: "",
        addressState: "",
        addressComplement: ""
    });

    const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>(user?.addresses?.[0]?.id || 'new');

    // --- CUPOM ---
    const [couponCode, setCouponCode] = useState("");
    // Agora armazenamos 'amount' e 'type' para suportar R$ Fixo e %
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number; type: string } | null>(null);
    const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });
    const [couponLoading, setCouponLoading] = useState(false);

    // --- STATUS GERAIS ---
    const [status, setStatus] = useState<{ type: 'error' | 'loading' | 'success' | null, msg: string }>({ type: null, msg: "" });
    const [shippingStatus, setShippingStatus] = useState<{ valid: boolean, msg: string, loading?: boolean } | null>(null);

    // --- EFEITOS & CÁLCULOS ---

    // 1. Preencher dados ao selecionar endereço salvo
    useEffect(() => {
        if (selectedAddressId !== 'new' && user) {
            const addr = user.addresses.find(a => a.id === selectedAddressId);
            if (addr) {
                setFormData(prev => ({
                    ...prev,
                    cep: addr.cep,
                    addressStreet: addr.street,
                    addressNumber: addr.number,
                    addressNeighborhood: addr.neighborhood,
                    addressCity: addr.city,
                    addressState: addr.state
                }));
                setShippingStatus({ valid: true, msg: "Endereço salvo selecionado." });
            }
        } else {
            // Limpa campos de endereço se for "Novo"
            setFormData(prev => ({
                ...prev,
                cep: "",
                addressStreet: "",
                addressNumber: "",
                addressNeighborhood: "",
                addressCity: "",
                addressState: "",
                addressComplement: ""
            }));
            setShippingStatus(null);
        }
    }, [selectedAddressId, user]);

    // 2. Cálculo de Totais (Subtotal, Desconto, Total)
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'FIXED') {
            discountAmount = appliedCoupon.amount;
        } else {
            // PERCENT
            discountAmount = subtotal * (appliedCoupon.amount / 100);
        }
    }

    const total = Math.max(0, subtotal - discountAmount);
    const formatMoney = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- HANDLERS ---

    // Busca CEP e preenche campos
    const handleBlurCep = async () => {
        const cleanCep = formData.cep.replace(/\D/g, "");
        if (cleanCep.length < 8) return;

        setShippingStatus({ valid: false, msg: "Buscando...", loading: true });

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await res.json();

            if (data.erro) {
                setShippingStatus({ valid: false, msg: "CEP não encontrado." });
            } else if (data.localidade !== "Osasco") {
                setShippingStatus({ valid: false, msg: `Entregas apenas em Osasco-SP.` });
            } else {
                setFormData(prev => ({
                    ...prev,
                    addressStreet: data.logradouro,
                    addressNeighborhood: data.bairro,
                    addressCity: data.localidade,
                    addressState: data.uf
                }));
                setShippingStatus({ valid: true, msg: "Frete Grátis • Entrega Própria" });
            }
        } catch (error) {
            setShippingStatus({ valid: false, msg: "Erro ao buscar CEP." });
        }
    };

    // Aplicar Cupom
    async function handleApplyCoupon() {
        if (!couponCode) return;

        setCouponLoading(true);
        setCouponStatus({ type: null, msg: "" });

        try {
            // CORREÇÃO AQUI: Passamos 'items' ao invés de 'subtotal'
            // Isso corrige o erro "items.map is not a function"
            const result = await validateCoupon(couponCode, items);

            if (result.error) {
                setCouponStatus({ type: 'error', msg: result.error });
                setAppliedCoupon(null);
            } else if (result.success) {
                // Sucesso: Guardamos amount e type para o cálculo
                setAppliedCoupon({
                    code: result.code!,
                    amount: result.amount!,
                    type: result.type!
                });
                setCouponStatus({ type: 'success', msg: result.message || "Cupom aplicado!" });
            }
        } catch (e) {
            setCouponStatus({ type: 'error', msg: "Erro de conexão ao validar cupom." });
        } finally {
            setCouponLoading(false);
        }
    }

    function handleRemoveCoupon() {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponStatus({ type: null, msg: "" });
    }

    // Finalizar Pagamento
    async function handlePayment() {
        if (!formData.name || !formData.email || !formData.cpf || !formData.addressNumber || !formData.addressStreet) {
            setStatus({ type: 'error', msg: "Por favor, preencha todos os campos do endereço, incluindo o número." });
            return;
        }
        if (shippingStatus?.valid === false) {
            setStatus({ type: 'error', msg: "Endereço de entrega inválido." });
            return;
        }

        setStatus({ type: 'loading', msg: "Redirecionando para pagamento..." });

        const result = await createCheckout(
            items.map(i => ({ id: i.id, quantity: i.quantity })),
            formData,
            appliedCoupon?.code
        );

        if (result.url) {
            router.push(result.url);
        } else {
            setStatus({ type: 'error', msg: result.error || "Erro desconhecido." });
        }
    }

    // Auth Handlers
    async function handleAuth(formData: FormData) {
        setAuthLoading(true);
        setAuthError("");
        formData.append("redirectTo", "/checkout");
        const action = authTab === 'login' ? login : register;
        const result: any = await action(formData);
        if (result?.error) {
            setAuthError(result.error);
            setAuthLoading(false);
        }
    }

    if (items.length === 0) return null;

    return (
        <main className="min-h-screen bg-[#F5F5F7] pb-24 font-sans">
            {/* Header Minimalista */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 max-w-6xl flex justify-between items-center">
                    <Link href="/carrinho" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Voltar
                    </Link>
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Checkout Seguro</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">

                {/* --- ETAPA 1: Login / Cadastro --- */}
                {!user && (
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white rounded-[32px] shadow-2xl border border-white p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <h2 className="text-3xl font-black text-gray-900 mb-2 relative z-10">Identifique-se</h2>
                            <p className="text-gray-500 mb-8 relative z-10">Para continuar sua compra com segurança.</p>

                            <div className="flex bg-gray-100 p-1.5 rounded-full mb-8 relative z-10">
                                <button
                                    onClick={() => setAuthTab('login')}
                                    className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${authTab === 'login' ? 'bg-white shadow-md text-black' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Já sou cliente
                                </button>
                                <button
                                    onClick={() => setAuthTab('register')}
                                    className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${authTab === 'register' ? 'bg-white shadow-md text-black' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Criar conta
                                </button>
                            </div>

                            <form action={handleAuth} className="space-y-4 relative z-10">
                                {authTab === 'register' && (
                                    <input name="name" placeholder="Seu Nome Completo" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold text-gray-900 transition-all" required />
                                )}
                                <input name="email" type="email" placeholder="Seu E-mail" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold text-gray-900 transition-all" required />
                                <input name="password" type="password" placeholder="Sua Senha" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold text-gray-900 transition-all" required />

                                {authError && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {authError}</div>}

                                <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    {authLoading ? <Loader2 className="animate-spin" /> : (authTab === 'login' ? 'Entrar Agora' : 'Cadastrar Grátis')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- ETAPA 2: Dados e Pagamento --- */}
                {user && (
                    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
                        <div className="space-y-8">

                            {/* Dados Pessoais */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-xs">1</span>
                                    Dados Pessoais
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome Completo *" className="p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl font-medium outline-none transition-colors" />
                                    <input name="email" value={formData.email} disabled className="p-4 bg-gray-100 rounded-xl text-gray-500 cursor-not-allowed font-medium border-2 border-transparent" />
                                    <input name="cpf" value={formData.cpf || ""} onChange={handleChange} placeholder="CPF *" className="p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl font-medium outline-none transition-colors" />
                                    <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Celular *" className="p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl font-medium outline-none transition-colors" />
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-xs">2</span>
                                    Entrega
                                </h3>

                                {/* Seleção de Endereços Salvos */}
                                {user.addresses.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                                        {user.addresses.map(addr => (
                                            <label key={addr.id} className={`flex-shrink-0 w-64 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-black bg-gray-900 text-white shadow-lg scale-105' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                                                <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="hidden" />
                                                <span className="font-bold text-sm block mb-1">{addr.name}</span>
                                                <p className={`text-xs ${selectedAddressId === addr.id ? 'text-gray-400' : 'text-gray-500'}`}>{addr.street}, {addr.number}</p>
                                                <p className={`text-xs ${selectedAddressId === addr.id ? 'text-gray-400' : 'text-gray-500'}`}>{addr.neighborhood}</p>
                                            </label>
                                        ))}
                                        <label className={`flex-shrink-0 w-40 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'}`}>
                                            <input type="radio" name="address" checked={selectedAddressId === 'new'} onChange={() => setSelectedAddressId('new')} className="hidden" />
                                            <Plus className="h-6 w-6 mb-2 text-gray-400" />
                                            <span className="font-bold text-sm text-gray-900">Novo</span>
                                        </label>
                                    </div>
                                )}

                                {/* Formulário de Novo Endereço */}
                                {selectedAddressId === 'new' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                name="cep"
                                                value={formData.cep}
                                                onChange={handleChange}
                                                onBlur={handleBlurCep}
                                                placeholder="CEP *"
                                                maxLength={9}
                                                className="p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl font-medium outline-none transition-colors"
                                            />
                                            {/* Status do CEP */}
                                            <div className="flex items-center">
                                                {shippingStatus?.loading && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
                                                {shippingStatus?.valid === true && <span className="text-green-600 font-bold text-sm flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {shippingStatus.msg}</span>}
                                                {shippingStatus?.valid === false && <span className="text-red-500 font-bold text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {shippingStatus.msg}</span>}
                                            </div>
                                        </div>

                                        {/* Campos expandidos automaticamente */}
                                        {(formData.addressStreet || shippingStatus?.valid) && (
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in">
                                                <div className="md:col-span-3">
                                                    <input name="addressStreet" value={formData.addressStreet} onChange={handleChange} placeholder="Rua / Avenida" className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-xl font-medium text-gray-500" readOnly />
                                                </div>
                                                <div>
                                                    <input name="addressNumber" value={formData.addressNumber} onChange={handleChange} placeholder="Número *" className="w-full p-4 bg-white border-2 border-yellow-400 focus:border-black rounded-xl font-bold text-black outline-none shadow-sm" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <input name="addressNeighborhood" value={formData.addressNeighborhood} onChange={handleChange} placeholder="Bairro" className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-xl font-medium text-gray-500" readOnly />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <input name="addressComplement" value={formData.addressComplement} onChange={handleChange} placeholder="Complemento (Ap, Bloco)" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl font-medium outline-none" />
                                                </div>
                                                <div className="md:col-span-4">
                                                    <input value={`${formData.addressCity} - ${formData.addressState}`} disabled className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-xl font-medium text-gray-400" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Coluna Direita: Resumo */}
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 sticky top-24">
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                    <Package className="h-5 w-5" /> Resumo
                                </h3>

                                <div className="space-y-4 mb-6 max-h-60 overflow-auto custom-scrollbar pr-2">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-sm">
                                            <span className="text-gray-600 font-medium w-2/3 truncate">{item.quantity}x {item.name}</span>
                                            <span className="font-bold text-gray-900">{formatMoney(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* ÁREA DE CUPOM */}
                                <div className="border-t border-gray-100 my-6 pt-6 space-y-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Possui um cupom?
                                    </label>
                                    <div className="relative">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Tag className="h-4 w-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="CÓDIGO"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        if (couponStatus.type === 'error') setCouponStatus({ type: null, msg: "" });
                                                    }}
                                                    disabled={!!appliedCoupon}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleApplyCoupon();
                                                        }
                                                    }}
                                                    className={`w-full pl-10 pr-3 py-3 bg-gray-50 border-2 rounded-xl text-sm font-bold uppercase outline-none transition-all ${couponStatus.type === 'error' ? 'border-red-200 focus:border-red-500 bg-red-50/30' :
                                                        couponStatus.type === 'success' ? 'border-green-200 bg-green-50/30 text-green-700' :
                                                            'border-transparent focus:bg-white focus:border-black'
                                                        }`}
                                                />
                                            </div>

                                            {appliedCoupon ? (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCoupon}
                                                    className="bg-red-100 text-red-600 px-4 rounded-xl hover:bg-red-200 transition-colors"
                                                    title="Remover Cupom"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || !couponCode}
                                                    className="bg-black text-white px-5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center"
                                                >
                                                    {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "APLICAR"}
                                                </button>
                                            )}
                                        </div>

                                        {/* Feedback do Cupom */}
                                        {couponStatus.msg && (
                                            <div className={`mt-3 p-3 rounded-lg text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1 ${couponStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {couponStatus.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                                                {couponStatus.msg}
                                            </div>
                                        )}
                                    </div>

                                    {/* Subtotal e Descontos */}
                                    <div className="flex justify-between text-sm text-gray-500 font-medium pt-2">
                                        <span>Subtotal</span>
                                        <span>{formatMoney(subtotal)}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50 p-2 rounded-lg border border-green-100">
                                            <span className="flex items-center gap-1">
                                                <Tag className="h-3 w-3" /> Cupom {appliedCoupon.code}
                                            </span>
                                            <span>- {formatMoney(discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Frete</span>
                                        <span className={shippingStatus?.valid ? "text-green-600 font-bold" : "text-gray-400 font-medium"}>
                                            {shippingStatus?.valid ? "Grátis" : "--"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-2">
                                        <span className="text-gray-900 font-bold">Total Final</span>
                                        <span className="block text-3xl font-black text-black tracking-tight">{formatMoney(total)}</span>
                                    </div>
                                </div>

                                {status.type === 'error' && (
                                    <div className="mb-4 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 text-center animate-pulse">
                                        {status.msg}
                                    </div>
                                )}

                                <button
                                    className="group w-full mt-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                                    onClick={handlePayment}
                                    disabled={status.type === 'loading'}
                                >
                                    {status.type === 'loading' ? (
                                        <><Loader2 className="h-5 w-5 animate-spin" /> PROCESSANDO...</>
                                    ) : (
                                        <>PAGAR COM MERCADO PAGO <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <ShieldCheck className="h-4 w-4 text-green-500" /> Compra 100% Segura
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
