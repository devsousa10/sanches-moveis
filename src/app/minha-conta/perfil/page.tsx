import { updateProfile } from "@/actions/profile";
import { prisma } from "@/lib/prisma";
import { UserCircle, Save, Lock, ShieldCheck, Phone, FileText } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    if (!session?.value) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: Number(session.value) }
    });

    if (!user) redirect("/login");

    const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <UserCircle className="h-8 w-8 text-black" /> Dados Pessoais
                </h1>
                <p className="text-gray-500 mt-2">Mantenha suas credenciais atualizadas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cartão de Identidade */}
                <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black text-3xl font-black mb-6 shadow-lg border-4 border-black ring-2 ring-yellow-500/50">
                        {initials}
                    </div>

                    <h2 className="text-2xl font-black mb-1">{user.name}</h2>
                    <p className="text-gray-400 text-sm mb-6">{user.email}</p>

                    <div className="bg-white/10 rounded-2xl p-4 w-full backdrop-blur-sm border border-white/10">
                        <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-xs">
                            <ShieldCheck className="h-4 w-4" /> Membro Verificado
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="lg:col-span-2">
                    <form action={updateProfile} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={user.name}
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold text-lg transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> CPF
                                    </label>
                                    <input
                                        type="text"
                                        name="cpf"
                                        defaultValue={user.cpf || ""}
                                        placeholder="000.000.000-00"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Telefone / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        defaultValue={user.phone || ""}
                                        placeholder="(11) 99999-9999"
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className="opacity-50 cursor-not-allowed">
                                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail (Não alterável)</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-xl outline-none font-medium text-gray-500"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-black text-black flex items-center gap-2 mb-4">
                                    <Lock className="h-4 w-4" /> Alterar Senha
                                </h3>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Nova senha (deixe em branco para manter)"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-medium transition-all"
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                <Save className="h-5 w-5" /> Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}