import { prisma } from "@/lib/prisma";
import { Search, Filter, Package, Truck, CheckCircle, Clock, AlertCircle, ChevronRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; q?: string }>;
}) {
    const { status, q } = await searchParams;

    // Filtros
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (q) {
        where.OR = [
            { id: { contains: q } },
            { customerName: { contains: q, mode: 'insensitive' } },
            { customerEmail: { contains: q, mode: 'insensitive' } }
        ];
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true }
    });

    // Função de Filtro
    async function filterOrders(formData: FormData) {
        "use server";
        const newStatus = formData.get("status") as string;
        const query = formData.get("q") as string;
        const params = new URLSearchParams();
        if (newStatus) params.set("status", newStatus);
        if (query) params.set("q", query);
        redirect(`/admin/pedidos?${params.toString()}`);
    }

    // Helpers de UI
    const getStatusStyle = (s: string) => {
        switch (s) {
            case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
            case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'DELIVERED': return 'bg-neutral-100 text-neutral-600 border-neutral-200';
            case 'CANCELED': return 'bg-red-50 text-red-500 border-red-100 opacity-70';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse'; // PENDING
        }
    };

    const getStatusLabel = (s: string) => {
        const map: Record<string, string> = {
            'PENDING': 'Aguardando Pagamento',
            'PAID': 'Pago / A Enviar',
            'SHIPPED': 'Enviado',
            'DELIVERED': 'Entregue',
            'CANCELED': 'Cancelado'
        };
        return map[s] || s;
    };

    const getStatusIcon = (s: string) => {
        switch (s) {
            case 'PAID': return <Package className="h-4 w-4" />;
            case 'SHIPPED': return <Truck className="h-4 w-4" />;
            case 'DELIVERED': return <CheckCircle className="h-4 w-4" />;
            case 'CANCELED': return <AlertCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Central de Pedidos <Package className="h-8 w-8 text-blue-600" />
                    </h1>
                    <p className="text-gray-500 mt-2">Monitore o fluxo logístico em tempo real.</p>
                </div>
            </div>

            {/* Toolbar de Filtros */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
                <form action={filterOrders} className="flex items-center gap-2 min-w-max">
                    {/* Input de Busca */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Buscar por ID, Nome ou Email..."
                            className="pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                        />
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-2"></div>

                    {/* Abas de Status (como botões de rádio estilizados) */}
                    {[
                        { val: 'ALL', label: 'Todos' },
                        { val: 'PENDING', label: 'Pendentes' },
                        { val: 'PAID', label: 'Pagos (Prioridade)' },
                        { val: 'SHIPPED', label: 'Em Trânsito' },
                    ].map((opt) => (
                        <button
                            key={opt.val}
                            type="submit"
                            name="status"
                            value={opt.val}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${(status === opt.val || (!status && opt.val === 'ALL'))
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </form>
            </div>

            {/* Grid de Pedidos */}
            <div className="space-y-4">
                {orders.map((order) => {
                    const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

                    return (
                        <Link
                            key={order.id}
                            href={`/admin/pedidos/${order.id}`}
                            className="block group"
                        >
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden">

                                {/* Barra lateral colorida baseada no status */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${order.status === 'PAID' ? 'bg-green-500' : order.status === 'PENDING' ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">

                                    {/* Info Principal */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-xs font-bold text-gray-400">#{order.id.slice(0, 8)}</span>
                                            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                            {order.customerName}
                                            {order.customerDoc && <span className="text-xs font-normal text-gray-400 bg-gray-50 px-1.5 rounded">{order.customerDoc}</span>}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                                            <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {totalItems} itens</span>
                                        </div>
                                    </div>

                                    {/* Valor e Ação */}
                                    <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                                            <p className="text-xl font-black text-gray-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                                            </p>
                                        </div>
                                        <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                            <ChevronRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Nenhum pedido encontrado com este filtro.</p>
                    </div>
                )}
            </div>
        </div>
    );
}