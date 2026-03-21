"use client";

import { saveUser } from "@/actions/users";
import { Save, ArrowLeft, User, Mail, Lock, Shield, ShieldCheck, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UserFormProps {
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

export function UserForm({ user }: UserFormProps) {
    const isEditing = !!user;

    // Estados para Live Preview
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [role, setRole] = useState(user?.role || "USER");

    // Lógica visual do Preview
    const isAdmin = role === 'ADMIN';
    const initials = name
        ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "??";

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/usuarios" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        {isEditing ? "Editar Perfil" : "Novo Usuário"}
                        {isAdmin ? <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500" /> : <User className="h-6 w-6 text-blue-500" />}
                    </h1>
                    <p className="text-gray-500">Gerencie acesso e permissões.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* --- COLUNA ESQUERDA: FORMULÁRIO --- */}
                <div className="lg:col-span-7">
                    <form action={saveUser} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                        <input type="hidden" name="id" value={user?.id || "0"} />

                        {/* Detalhe de fundo */}
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 ${isAdmin ? 'bg-yellow-400/20' : 'bg-blue-400/20'}`}></div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Credenciais de Acesso
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ex: João da Silva"
                                            className="w-full pl-12 p-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold text-lg transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Endereço de Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Ex: joao@email.com"
                                            className="w-full pl-12 p-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Senha */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {isEditing ? "Nova Senha (Opcional)" : "Senha Inicial"}
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder={isEditing ? "Deixe em branco para manter a atual" : "Crie uma senha forte"}
                                            className="w-full pl-12 p-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium transition-all"
                                            required={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-8" />

                        {/* Seção Permissões */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Nível de Permissão
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${role === 'USER' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="USER"
                                        checked={role === 'USER'}
                                        onChange={() => setRole('USER')}
                                        className="sr-only"
                                    />
                                    <User className="h-6 w-6" />
                                    <span className="font-bold text-sm">Cliente (User)</span>
                                </label>

                                <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${role === 'ADMIN' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-100 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="ADMIN"
                                        checked={role === 'ADMIN'}
                                        onChange={() => setRole('ADMIN')}
                                        className="sr-only"
                                    />
                                    <Crown className="h-6 w-6" />
                                    <span className="font-bold text-sm">Administrador</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-8 mt-4">
                            <button
                                type="submit"
                                className={`w-full text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 ${isAdmin ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                <Save className="h-5 w-5" />
                                {isEditing ? "Salvar Alterações" : "Criar Usuário"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- COLUNA DIREITA: CARD PREVIEW --- */}
                <div className="lg:col-span-5 sticky top-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                        Preview do Perfil
                    </h3>

                    {/* O Cartão de Identidade */}
                    <div className={`relative w-full aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${isAdmin ? 'bg-neutral-900 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>

                        {/* Background Decorativo */}
                        <div className="absolute inset-0 opacity-20">
                            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${isAdmin ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                            <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 ${isAdmin ? 'bg-purple-900' : 'bg-cyan-100'}`}></div>
                        </div>

                        {/* Conteúdo do Card */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">

                            {/* Avatar */}
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black mb-6 shadow-xl border-4 ${isAdmin ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-neutral-800 text-black' : 'bg-gradient-to-br from-blue-400 to-blue-600 border-white text-white'}`}>
                                {initials}
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-8">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${isAdmin ? 'bg-yellow-500 text-black' : 'bg-blue-100 text-blue-700'}`}>
                                    {isAdmin ? 'Team Leader' : 'Customer'}
                                </span>
                                <h2 className="text-3xl font-black leading-tight break-words">
                                    {name || "Nome do Usuário"}
                                </h2>
                                <p className={`text-sm font-medium ${isAdmin ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {email || "email@exemplo.com"}
                                </p>
                            </div>

                            {/* Stats Fictícios (Preview) */}
                            <div className={`w-full grid grid-cols-2 gap-px rounded-2xl overflow-hidden ${isAdmin ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <div className={`p-4 ${isAdmin ? 'bg-neutral-800/50' : 'bg-gray-50'}`}>
                                    <p className={`text-[10px] uppercase font-bold ${isAdmin ? 'text-gray-500' : 'text-gray-400'}`}>Pedidos</p>
                                    <p className="text-xl font-black">0</p>
                                </div>
                                <div className={`p-4 ${isAdmin ? 'bg-neutral-800/50' : 'bg-gray-50'}`}>
                                    <p className={`text-[10px] uppercase font-bold ${isAdmin ? 'text-gray-500' : 'text-gray-400'}`}>Total Gasto</p>
                                    <p className="text-xl font-black">R$ 0</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            {isAdmin
                                ? "Este usuário terá acesso total ao painel administrativo."
                                : "Este usuário terá acesso apenas à área de compras (Loja)."}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}