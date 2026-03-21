import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured() {
    return Boolean(process.env.DATABASE_URL?.trim());
}

export async function withDatabaseFallback<T>(
    operation: () => Promise<T>,
    fallback: T,
    context: string
): Promise<T> {
    if (!isDatabaseConfigured()) {
        console.error(`[Database] DATABASE_URL ausente em ${context}.`);
        return fallback;
    }

    try {
        return await operation();
    } catch (error) {
        console.error(`[Database] Falha em ${context}:`, error);
        return fallback;
    }
}
