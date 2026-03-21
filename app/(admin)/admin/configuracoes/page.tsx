import { SettingsForm } from "@/components/admin/SettingsForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const settings = await prisma.storeSettings.findFirst();

    const plainSettings = settings ? {
        storeName: settings.storeName,
        phone: settings.phone ?? "",
        address: settings.address ?? "",
        freeShippingMin: 0
    } : null;

    return <SettingsForm settings={plainSettings} />;
}
