"use client";

import { register } from "@/actions/auth";
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const result = await register(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

                <div className="bg-black p-6 text-center">
                    <h1 className="text-xl font-bold text-yellow-500">Criar Nova Conta</h1>
                    <p className="text-gray-400 text-sm mt-1">Junte-se à Sanches Móveis</p>
                </div>

                <div className="p-8">
                    <form action={handleSubmit} className="space-y-4">

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded flex items-center gap-2 text-sm font-medium">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Seu nome"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="seu@email.com"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Mínimo 6 caracteres"
                                    minLength={6}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Criando...</>
                            ) : (
                                <>Criar Conta <ArrowRight className="h-5 w-5" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
                        <Link href="/login" className="text-sm font-bold text-black hover:text-yellow-600 hover:underline">
                            Fazer Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}