"use client";

import { login } from "@/actions/auth";
import { Loader2, ArrowRight, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // Se sucesso, o redirect acontece no server action
    }

    return (
        <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorativo */}
            <div className="absolute inset-0 bg-[radial-gradient(#a3a3a3_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

            {/* Container Principal */}
            <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-white/50 p-8 md:p-12 relative z-10">

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-yellow-50 rounded-full mb-6 animate-pulse">
                        <Sparkles className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
                        Acesse sua conta
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Entre para gerenciar pedidos e favoritos.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    {/* Input E-mail */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="email">
                            E-mail
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Input Senha */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="password">
                                Senha
                            </label>
                            <Link href="#" className="text-xs font-bold text-yellow-600 hover:text-black transition-colors">
                                Esqueceu?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Botão de Ação */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neutral-900 text-white font-black text-lg py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 group"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                Entrar
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-yellow-500" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer do Card */}
                <div className="mt-10 text-center border-t border-gray-100 pt-8">
                    <p className="text-gray-400 text-sm font-medium">
                        Novo por aqui?{" "}
                        <Link href="/cadastro" className="text-black font-bold hover:underline decoration-yellow-500 decoration-2 underline-offset-4">
                            Criar conta gratuita
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}