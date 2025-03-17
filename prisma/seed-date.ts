import { Prisma, PrismaClient, UserRole, ApprovedStatus, VoteStatus } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function batchInsert<T>(
    data: T[],
    batchSize: number,
    insertFunction: (batch: T[]) => Promise<void>
) {
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize)
        await insertFunction(batch)
    }
}

async function deleteAllSupabaseUsers() {
    console.log('Deleting existing Supabase authentication users...')
    let hasMore = true
    while (hasMore) {
        const { data, error } = await supabase.auth.admin.listUsers({ perPage: 100 })
        if (error) throw error

        const users = data.users
        if (!users || users.length === 0) {
            hasMore = false
            break
        }

        await Promise.all(
            users.map(async (user) => {
                await supabase.auth.admin.deleteUser(user.id)
            })
        )
    }
}

async function main() {
    console.log('Starting database seeding...')

    // Clean up
    await deleteAllSupabaseUsers()
    await prisma.approvedBy.deleteMany()
    await prisma.vote.deleteMany()
    await prisma.projectProposal.deleteMany()
    await prisma.budgetOverview.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.user.deleteMany()

    // Create Users
    const customUsersData = [
        { name: 'Admin User', email: 'admin@example.com', password: 'test', phone: '+639630305154', role: UserRole.Admin, profile: null },
        { name: 'Education User', email: 'education@example.com', password: 'test', phone: faker.phone.number({ style: 'international' }), role: UserRole.Education, profile: null },
        { name: 'Environment User', email: 'environment@example.com', password: 'test', phone: faker.phone.number({ style: 'international' }), role: UserRole.Environment, profile: null },
        { name: 'Finance User', email: 'finance@example.com', password: 'test', phone: faker.phone.number({ style: 'international' }), role: UserRole.Finance, profile: null },
        { name: 'Health Services User', email: 'healthservices@example.com', password: 'test', phone: faker.phone.number({ style: 'international' }), role: UserRole.HealthServices, profile: null },
        { name: 'Peace Order User', email: 'peaceorder@example.com', password: 'test', phone: faker.phone.number({ style: 'international' }), role: UserRole.PeaceOrder, profile: null },
        { name: 'Public Works User', email: 'publicworks@example.com', password: 'test', phone: faker.phone.number({ style: 'international' }), role: UserRole.PublicWorks, profile: null },
        { name: 'Women User', email: 'women@example.com', password: 'test', phone: faker.phone.number({ style: 'international' }), role: UserRole.Women, profile: null },
    ]

    const users = await Promise.all(
        customUsersData.map(async (user) => {
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
            })
            if (error || !data?.user) throw error

            const hashedPassword = await bcrypt.hash(user.password, 10)
            return prisma.user.create({
                data: {
                    id: data.user.id,
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    phone: user.phone,
                    role: user.role,
                    profile: null
                },
            })
        })
    )

    // Create BudgetOverviews
    const budgetOverviews = await prisma.budgetOverview.createMany({
        data: Object.values(UserRole).map(role => ({
            totalBudget: faker.number.float({ min: 10000, max: 1000000, fractionDigits: 2 }),
            allocatedBudget: 0,
            remainingBudget: faker.number.float({ min: 10000, max: 1000000, fractionDigits: 2 }),
            month: faker.date.recent(),
            committeeRole: role,
        })),
    })

    // Create ProjectProposals
    const budgetOverviewList = await prisma.budgetOverview.findMany()
    const projectProposals = await prisma.projectProposal.createMany({
        data: Array.from({ length: 20 }, () => {
            const user = faker.helpers.arrayElement(users)
            const budget = faker.helpers.arrayElement(budgetOverviewList)
            return {
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                proposedDate: faker.date.recent(),
                fileUrl: 'https://cyyzyqahffwimgclmplx.supabase.co/storage/v1/object/public/project_files/1742178096658-83261e38-6833-4cda-b156-acb114c29363.pdf',
                postedById: user.id,
                budget: faker.number.float({ min: 1000, max: 500000, fractionDigits: 2 }),
                committee: user.role,
                budgetOverviewId: faker.helpers.maybe(() => budget.id, { probability: 0.7 }),
            }
        }),
    })

    // Create Notifications
    const notifications = await prisma.notification.createMany({
        data: Array.from({ length: 30 }, () => ({
            phone: faker.phone.number({ style: 'international' }),
            message: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(['Pending', 'Sent', 'Failed']),
            bookingNumber: faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.5 }),
        })),
    })

    // Create Votes
    const proposals = await prisma.projectProposal.findMany()
    const votes = await batchInsert(
        Array.from({ length: 50 }, () => {
            const proposal = faker.helpers.arrayElement(proposals)
            return {
                userId: faker.helpers.arrayElement(users).id,
                proposalId: proposal.id,
                vote: faker.helpers.enumValue(VoteStatus),
                comment: faker.lorem.sentence(),
            }
        }),
        10,
        async (batch) => {
            await prisma.vote.createMany({ data: batch, skipDuplicates: true })
        }
    )

    // Create ApprovedBy
    const approvedBy = await batchInsert(
        Array.from({ length: 30 }, () => {
            const proposal = faker.helpers.arrayElement(proposals)
            return {
                userId: faker.helpers.arrayElement(users).id,
                proposalId: proposal.id,
                status: faker.helpers.enumValue(ApprovedStatus),
                comment: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }),
            }
        }),
        10,
        async (batch) => {
            await prisma.approvedBy.createMany({ data: batch, skipDuplicates: true })
        }
    )

    console.log('Seeding complete!')
    console.log(`Created ${users.length} users`)
    console.log(`Created ${budgetOverviews.count} budget overviews`)
    console.log(`Created ${projectProposals.count} project proposals`)
    console.log(`Created ${notifications.count} notifications`)
    console.log(`Created 50 votes`)
    console.log(`Created 30 approvedBy records`)
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })