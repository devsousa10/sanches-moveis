import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('123456', 10)

    // 1. Criar Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@sanches.com' },
        update: {},
        create: {
            email: 'admin@sanches.com',
            name: 'Admin Sanches',
            password,
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // 2. Criar Configurações Iniciais da Loja (O que estava faltando!)
    const settings = await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            storeName: 'Sanches Móveis',
            phone: '(11) 99999-9999',
            email: 'contato@sanchesmoveis.com.br',
            primaryColor: '#EAB308',
            secondaryColor: '#000000',
            freeShippingMin: 0,
        },
    })
    console.log({ settings })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })