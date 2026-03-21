import { updateOrderStatus, updateTrackingCode } from "@/actions/orders";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Box, Calendar, CreditCard, Mail, MapPin, MessageSquare, Phone, Printer, Save, Truck, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } }
    });

    if (!order) return notFound();

    // Utilitários
    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(date);

    // Timeline Logic
    const steps = [
        { id: 'PENDING', label: 'Pedido Recebido', icon: Box },
        { id: 'PAID', label: 'Pagamento Aprovado', icon: CreditCard },
        { id: 'SHIPPED', label: 'Enviado / Em Trânsito', icon: Truck },
        { id: 'DELIVERED', label: 'Entregue', icon: MapPin },
    ];

    // Encontra o índice do status atual
    const currentStepIndex = steps.findIndex(s => s.id === order.status);
    const activeIndex = currentStepIndex === -1 && order.status === 'CANCELED' ? -1 : currentStepIndex;

    // Link WhatsApp Generator
    const waMessage = `Olá ${order.customerName.split(' ')[0]}! Tudo bem? Aqui é da Sanches Móveis. Estou entrando em contato sobre seu pedido #${order.id.slice(0, 5)}.`;
    const waLink = `https://wa.me/55${order.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`;

    return (
        <div className="min-h-screen pb-20">
            {/* Header Flutuante */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/pedidos" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pedido #{order.id.slice(0, 8)}</h1>
                        {order.status === 'CANCELED' && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">CANCELADO</span>}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" /> Realizado em {formatDate(order.createdAt)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* --- COLUNA ESQUERDA (Detalhes e Cliente) --- */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Lista de Produtos */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Box className="h-5 w-5 text-blue-600" /> Itens do Pedido</h2>
                            <span className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">
                                {order.items.length} itens
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                                    {/* Imagem Thumb */}
                                    <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                        {item.product.images[0] && (
                                            <img src={item.product.images[0]} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qtd: {item.quantity} x {formatMoney(Number(item.price))}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatMoney(Number(item.price) * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Total do Pedido</span>
                                <span className="text-2xl font-black text-gray-900">{formatMoney(Number(order.total))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dados do Cliente e Entrega */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cliente */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="h-5 w-5 text-gray-400" /> Dados do Cliente</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                                        {order.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{order.customerName}</p>
                                        <p className="text-gray-500 text-xs">Documento: {order.customerDoc || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="h-4 w-4" /> {order.customerEmail}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="h-4 w-4" /> {order.customerPhone || "Não informado"}
                                </div>

                                {order.customerPhone && (
                                    <a href={waLink} target="_blank" className="mt-4 flex items-center justify-center gap-2 w-full bg-green-50 text-green-700 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors">
                                        <MessageSquare className="h-4 w-4" /> Conversar no WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Entrega */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-gray-400" /> Endereço de Entrega</h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 h-full">
                                <p className="text-gray-800 font-medium leading-relaxed">
                                    {order.shippingAddress || "Endereço não registrado."}
                                </p>
                                {order.shippingCep && (
                                    <span className="inline-block mt-3 bg-white px-2 py-1 rounded border border-gray-200 text-xs font-bold text-gray-500">
                                        CEP: {order.shippingCep}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLUNA DIREITA (Ações e Timeline) --- */}
                <div className="space-y-6">

                    {/* Card de Status e Timeline Visual */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Status do Pedido</h3>

                        {/* A Timeline */}
                        <div className="relative pl-4 space-y-8 before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {steps.map((step, index) => {
                                const isCompleted = activeIndex >= index;
                                const isCurrent = activeIndex === index;

                                return (
                                    <div key={step.id} className={`relative flex items-center gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-300 text-gray-300'}`}>
                                            <step.icon className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${isCurrent ? 'text-black' : 'text-gray-500'}`}>{step.label}</p>
                                            {isCurrent && <p className="text-xs text-blue-600 font-medium animate-pulse">Etapa Atual</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Controles de Status Manual */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <form action={updateOrderStatus} className="space-y-3">
                                <input type="hidden" name="id" value={order.id} />
                                <label className="text-xs font-bold text-gray-400 uppercase">Atualizar Manualmente</label>
                                <select
                                    name="status"
                                    defaultValue={order.status}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-black outline-none"
                                >
                                    <option value="PENDING">Pendente</option>
                                    <option value="PAID">Pago</option>
                                    <option value="SHIPPED">Enviado</option>
                                    <option value="DELIVERED">Entregue</option>
                                    <option value="CANCELED">Cancelado</option>
                                </select>
                                <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex justify-center gap-2">
                                    <Save className="h-4 w-4" /> Salvar Status
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Card de Rastreio */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-gray-400" /> Rastreamento</h3>

                        {order.trackingCode ? (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Código Registrado</p>
                                <p className="text-lg font-mono font-bold text-blue-900 tracking-widest">{order.trackingCode}</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-sm text-gray-500 mb-4">
                                Nenhum código informado.
                            </div>
                        )}

                        <form action={updateTrackingCode} className="space-y-3">
                            <input type="hidden" name="id" value={order.id} />
                            <input
                                type="text"
                                name="trackingCode"
                                defaultValue={order.trackingCode || ""}
                                placeholder="Cole o código aqui..."
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                            />
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" name="notify" id="notify" className="rounded text-black focus:ring-black" defaultChecked />
                                <label htmlFor="notify">Notificar cliente (Email)</label>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                Atualizar Rastreio
                            </button>
                        </form>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors text-gray-600 font-bold text-sm">
                            <Printer className="h-6 w-6 text-gray-400" />
                            Imprimir Pedido
                        </button>
                        {/* Placeholder para futuras integrações */}
                        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors text-gray-600 font-bold text-sm opacity-50 cursor-not-allowed">
                            <FileIcon className="h-6 w-6 text-gray-400" />
                            Nota Fiscal
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

function FileIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
    )
}