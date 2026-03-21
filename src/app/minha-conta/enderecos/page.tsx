import { prisma } from "@/lib/prisma";
import { deleteAddress } from "@/actions/addresses";
import { MapPin, Plus, Trash2, Edit, Home, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddressesPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    if (!session?.value) redirect("/login");

    const addresses = await prisma.address.findMany({
        where: { userId: Number(session.value) },
        // CORREÇÃO: Ordenar por ID pois Address não tem createdAt
        orderBy: { id: 'desc' }
    });

    // Helper para ícone
    const getIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("trabalho") || lower.includes("escritório")) return <Briefcase className="h-6 w-6" />;
        if (lower.includes("loja") || lower.includes("empresa")) return <Building2 className="h-6 w-6" />;
        return <Home className="h-6 w-6" />;
    }

    return (
        <div>
            <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <MapPin className="h-8 w-8 text-black" /> Meus Endereços
                    </h1>
                    <p className="text-gray-500 mt-2">Gerencie seus pontos de entrega exclusivos.</p>
                </div>
                <Link href="/minha-conta/enderecos/novo" className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group">
                    <div className="bg-yellow-500 rounded-full p-1 group-hover:rotate-90 transition-transform">
                        <Plus className="h-3 w-3 text-black" />
                    </div>
                    Novo Endereço
                </Link>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
                    <div className="h-20 w-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Nenhum endereço salvo</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Cadastre um local para receber seus móveis com segurança.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="group relative bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-black transition-all duration-300 overflow-hidden">

                            {/* Efeito de Fundo */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-400 transition-colors duration-500 -z-0"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-yellow-400 transition-colors duration-300 shadow-inner">
                                            {getIcon(addr.name)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 leading-none">{addr.name}</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase mt-1 tracking-wider">{addr.recipient}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/minha-conta/enderecos/${addr.id}`}
                                            className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                                            title="Editar"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <form action={deleteAddress}>
                                            <input type="hidden" name="id" value={addr.id} />
                                            <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Excluir">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="space-y-1 pl-1 border-l-2 border-gray-100 group-hover:border-yellow-400 transition-colors pl-4">
                                    <p className="font-bold text-gray-900 text-lg">
                                        {addr.street}, {addr.number}
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium">
                                        {addr.complement && `${addr.complement} • `} {addr.neighborhood}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {addr.city} - {addr.state}
                                    </p>
                                    <p className="font-mono font-bold text-black pt-2 tracking-widest text-sm">
                                        CEP: {addr.cep}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}