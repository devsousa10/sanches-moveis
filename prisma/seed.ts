import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('123456', 10)

    // Criar Admin
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