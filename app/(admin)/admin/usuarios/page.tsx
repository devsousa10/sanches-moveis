import { toggleUserRole, deleteUser } from "@/actions/users";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Crown, User as UserIcon, MoreHorizontal, ShoppingBag, Trash2, Edit, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; role?: string }>;
}) {
    const { q, role } = await searchParams;

    const where: any = {};
    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } }
        ];
    }
    if (role && role !== 'ALL') where.role = role;

    // Busca usuários com estatísticas de pedidos (LTV)
    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            orders: {
                where: { status: 'PAID' },
                select: { total: true }
            },
            _count: {
                select: { orders: true }
            }
        }
    });

    async function handleSearch(formData: FormData) {
        "use server";
        const query = formData.get("q") as string;
        const roleFilter = formData.get("role") as string;
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (roleFilter) params.set("role", roleFilter);
        redirect(`/admin/usuarios?${params.toString()}`);
    }

    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Equipe & Clientes <UserIcon className="h-8 w-8 text-black" />
                    </h1>
                    <p className="text-gray-500 mt-2">Gerencie permissões e visualize o valor do cliente (LTV).</p>
                </div>
                <Link
                    href="/admin/usuarios/novo"
                    className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-900 hover:-translate-y-1 transition-all flex items-center gap-2 font-bold"
                >
                    <Plus className="h-4 w-4" /> Novo Usuário
                </Link>
            </div>

            {/* Filtros */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
                <form action={handleSearch} className="flex items-center gap-2 min-w-max">
                    <div className="relative group">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Buscar por Nome ou Email..."
                            className="pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-black w-64 transition-all"
                        />
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-2"></div>

                    {[
                        { val: 'ALL', label: 'Todos' },
                        { val: 'ADMIN', label: 'Administradores' },
                        { val: 'USER', label: 'Clientes' },
                    ].map((opt) => (
                        <button
                            key={opt.val}
                            type="submit"
                            name="role"
                            value={opt.val}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${(role === opt.val || (!role && opt.val === 'ALL'))
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </form>
            </div>

            {/* Grid de Cards (CRM Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => {
                    // Cálculos
                    const totalSpent = user.orders.reduce((acc, order) => acc + Number(order.total), 0);
                    const isAdmin = user.role === 'ADMIN';
                    const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

                    return (
                        <div key={user.id} className={`group relative rounded-3xl p-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isAdmin ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-white border border-gray-100 shadow-sm'}`}>

                            {/* Conteúdo do Card */}
                            <div className={`h-full rounded-[20px] p-6 flex flex-col ${isAdmin ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>

                                {/* Header do Card */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${isAdmin ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' : 'bg-gray-100 text-gray-500'}`}>
                                        {initials}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/usuarios/${user.id}`} className={`p-2 rounded-lg transition-colors ${isAdmin ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-black'}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>

                                        {/* Quick Role Toggle */}
                                        <form action={toggleUserRole.bind(null, user.id)}>
                                            <button
                                                className={`p-2 rounded-lg transition-colors ${isAdmin ? 'hover:bg-gray-800 text-yellow-500' : 'hover:bg-gray-100 text-gray-300 hover:text-blue-500'}`}
                                                title={isAdmin ? "Rebaixar para Cliente" : "Promover a Admin"}
                                            >
                                                {isAdmin ? <ShieldAlert className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="mb-6 flex-1">
                                    <h3 className="text-xl font-bold truncate pr-2">{user.name}</h3>
                                    <p className={`text-sm truncate ${isAdmin ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isAdmin ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                            {isAdmin ? <Crown className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats (LTV) */}
                                <div className={`grid grid-cols-2 gap-px rounded-xl overflow-hidden ${isAdmin ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className={`p-3 text-center ${isAdmin ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                        <p className={`text-[10px] font-bold uppercase mb-0.5 ${isAdmin ? 'text-gray-500' : 'text-gray-400'}`}>Pedidos</p>
                                        <p className="font-black text-lg">{user._count.orders}</p>
                                    </div>
                                    <div className={`p-3 text-center ${isAdmin ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                        <p className={`text-[10px] font-bold uppercase mb-0.5 ${isAdmin ? 'text-gray-500' : 'text-gray-400'}`}>LTV (Gasto)</p>
                                        <p className={`font-black text-lg ${isAdmin ? 'text-yellow-400' : 'text-green-600'}`}>
                                            {formatMoney(totalSpent)}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-700/20 flex justify-center">
                                    <form action={deleteUser}>
                                        <input type="hidden" name="id" value={user.id} />
                                        <button className={`text-xs font-bold flex items-center gap-1 hover:underline ${isAdmin ? 'text-red-400' : 'text-red-500'}`}>
                                            <Trash2 className="h-3 w-3" /> Excluir Usuário
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {users.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                        <UserIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">Nenhum usuário encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}