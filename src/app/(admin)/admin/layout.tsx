import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Fixa */}
            <AdminSidebar />

            {/* Área de Conteúdo (Deslocada para a direita) */}
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}