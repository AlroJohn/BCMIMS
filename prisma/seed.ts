import { Prisma, PrismaClient, UserRole, ProjectProposalStatus } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Initialize Supabase client for Auth using service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role key to create users

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Utility function to insert data in batches
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
    // List users from Supabase Auth with pagination
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 100 })
    if (error) {
      console.error('Error fetching Supabase users:', error)
      return
    }

    // Log the complete fetched data for debugging
    console.log('Fetched users data:', data)

    // Extract the array of users from the returned data
    const users = data.users

    if (!users || users.length === 0) {
      console.log('No more users to delete.')
      hasMore = false
      break
    }

    await Promise.all(
      users.map(async (user) => {
        console.log(`Attempting to delete user: ${user.email} (ID: ${user.id})`)
        const { data: deleteData, error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteError) {
          console.error(`Error deleting user ${user.email}:`, deleteError)
        } else {
          console.log(`Successfully deleted user ${user.email}`, deleteData)
        }
      })
    )
  }
}

async function main() {
  console.log('Starting database seeding...')

  // **Step 1: Delete existing authentication data in Supabase**
  await deleteAllSupabaseUsers()

  // **Step 2: Cleaning existing data in Prisma**
  console.log('Cleaning existing database records...')
  await prisma.projectProposal.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()

  // **Step 3: Creating Custom Users in Supabase Auth and Prisma**
  console.log('Creating custom users...')
  const customUsersData = [
    { name: 'Admin User', email: 'admin@example.com', password: 'admin123', phone: faker.phone.number({ style: 'international' }), role: UserRole.Admin },
    { name: 'Education User', email: 'education@example.com', password: 'education123', phone: faker.phone.number({ style: 'international' }), role: UserRole.Education },
    { name: 'Environment User', email: 'environment@example.com', password: 'environment123', phone: faker.phone.number({ style: 'international' }), role: UserRole.Environment },
    { name: 'Finance User', email: 'finance@example.com', password: 'finance123', phone: faker.phone.number({ style: 'international' }), role: UserRole.Finance },
    { name: 'Health Services User', email: 'healthservices@example.com', password: 'healthservices123', phone: faker.phone.number({ style: 'international' }), role: UserRole.HealthServices },
    { name: 'Peace Order User', email: 'peaceorder@example.com', password: 'peaceorder123', phone: faker.phone.number({ style: 'international' }), role: UserRole.PeaceOrder },
    { name: 'Public Works User', email: 'publicworks@example.com', password: 'publicworks123', phone: faker.phone.number({ style: 'international' }), role: UserRole.PublicWorks },
    { name: 'Woomen User', email: 'woomen@example.com', password: 'woomen123', phone: faker.phone.number({ style: 'international' }), role: UserRole.Woomen },
  ]

  const customUsers = await Promise.all(
    customUsersData.map(async (user) => {
      // Insert user into Supabase Auth using the admin API with email_confirmed_at set
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Mark email as confirmed
      })
      if (error) {
        console.error(`Error creating Supabase auth user for ${user.email}:`, error)
      } else {
        console.log(`Created Supabase auth user for ${user.email}`)
      }

      // Hash password for Prisma DB and create user record
      const hashedPassword = await bcrypt.hash(user.password, 10)
      return prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          phone: user.phone,
          role: user.role,
        },
      })
    })
  )
  console.log(`Created ${customUsers.length} custom users in Prisma DB`)

  // **Step 4: Seeding Random Users**
  console.log('Creating random users...')
  const userRoles = Object.values(UserRole) as UserRole[]
  const randomUsers: Prisma.UserCreateManyInput[] = []
  const randomUsersAuthData: { email: string; password: string }[] = []
  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const role = faker.helpers.arrayElement(userRoles)
    const email = faker.internet.email({ firstName, lastName })
    const plainPassword = 'password123'
    randomUsers.push({
      name: `${firstName} ${lastName}`,
      email,
      password: await bcrypt.hash(plainPassword, 10),
      phone: faker.phone.number({ style: 'international' }),
      role,
    })
    randomUsersAuthData.push({ email, password: plainPassword })
  }

  // Insert random users into Supabase Auth with email_confirmed_at set
  await Promise.all(
    randomUsersAuthData.map(async (user) => {
      const { error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })
      if (error) {
        console.error(`Error creating Supabase auth user for ${user.email}:`, error)
      } else {
        console.log(`Created Supabase auth user for ${user.email}`)
      }
    })
  )

  // Batch insert random users into Prisma DB
  await batchInsert<Prisma.UserCreateManyInput>(randomUsers, 10, async (batch) => {
    await prisma.user.createMany({ data: batch })
  })
  console.log(`Total users created in Prisma DB: ${await prisma.user.count()}`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
