import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Ou sua lógica de auth

export const dynamic = "force-dynamic";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
    // Verificação básica de sessão (Exemplo)
    // const session = await getSession();
    // if (!session) redirect("/login");

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <CustomerSidebar />
            <main className="flex-1 md:ml-64 p-8 animate-in fade-in duration-500">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
