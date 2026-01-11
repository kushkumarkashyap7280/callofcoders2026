import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { getDatabaseUrl, NODE_ENV } from '@/config/env'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma