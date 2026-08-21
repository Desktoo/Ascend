import { env } from "@day-mark/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, Prisma, PriorityLevel } from "@prisma/client"


const connectionString = `${env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export type PrismaClientType = PrismaClient
export { prisma, Prisma, PriorityLevel }