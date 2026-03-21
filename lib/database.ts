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
