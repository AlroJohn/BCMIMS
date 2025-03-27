import { PrismaClient, UserRole } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
  await prisma.user.deleteMany()

  // Create Users with dummy names for middleName, lastName, and suffixName
  const customUsersData = [
    {
      name: 'Admin',
      middleName: 'L.',
      lastName: 'Alfonso',
      suffixName: 'S.',
      profile: null,
      email: 'admin@example.com',
      password: 'test',
      phone: '+639630305154',
      role: UserRole.Admin,
      subRole: false,
      metadata: { seeded: true },
    },
    {
      name: 'Education',
      middleName: 'H.',
      lastName: 'Boneo',
      suffixName: 'T.',
      profile: null,
      email: 'education@example.com',
      password: 'test',
      phone: '+639123456789',
      role: UserRole.Education,
      subRole: false,
      metadata: { seeded: true },
    },
    {
      name: 'Environment',
      middleName: 'O.',
      lastName: 'Toledo',
      suffixName: 'K.',
      profile: null,
      email: 'environment@example.com',
      password: 'test',
      phone: '+639987654321',
      role: UserRole.Environment,
      subRole: false,
      metadata: { seeded: true },
    },
    {
      name: 'Finance',
      middleName: 'A.',
      lastName: 'Apolo',
      suffixName: 'Jr.',
      profile: null,
      email: 'finance@example.com',
      password: 'test',
      phone: '+639112233445',
      role: UserRole.Finance,
      subRole: false,
      metadata: { seeded: true },
    },
    {
      name: 'Health Services',
      middleName: 'P.',
      lastName: 'Serano',
      suffixName: 'Jr.',
      profile: null,
      email: 'healthservices@example.com',
      password: 'test',
      phone: '+639556677889',
      role: UserRole.HealthServices,
      subRole: false,
      metadata: { seeded: true },
    },
    {
      name: 'Peace Order',
      middleName: 'A.',
      lastName: 'Mercado',
      suffixName: 'Jr.',
      profile: null,
      email: 'peaceorder@example.com',
      password: 'test',
      phone: '+639998877665',
      role: UserRole.PeaceOrder,
      subRole: false,
      metadata: { seeded: true },
    },
    {
      name: 'Public Works',
      middleName: 'B.',
      lastName: 'Marcos',
      suffixName: 'Jr.',
      profile: null,
      email: 'publicworks@example.com',
      password: 'test',
      phone: '+639334455667',
      role: UserRole.PublicWorks,
      subRole: false,
      metadata: { seeded: true },
    },
    {
      name: 'Women',
      middleName: 'C.',
      lastName: 'Duterte',
      suffixName: 'Jr.',
      profile: null,
      email: 'women@example.com',
      password: 'test',
      phone: '+639776655443',
      role: UserRole.Women,
      subRole: false,
      metadata: { seeded: true },
    },
  ]

  const users = await Promise.all(
    customUsersData.map(async (user) => {
      // Create the authentication user in Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })
      if (error || !data?.user) throw error

      // Hash the password for storing in the database
      const hashedPassword = await bcrypt.hash(user.password, 10)
      
      // Create the user record in the database with dummy name details
      return prisma.user.create({
        data: {
          id: data.user.id,
          name: user.name,
          middleName: user.middleName,
          lastName: user.lastName,
          suffixName: user.suffixName,
          profile: user.profile,
          email: user.email,
          password: hashedPassword,
          phone: user.phone,
          role: user.role,
          subRole: user.subRole,
          metadata: user.metadata,
        },
      })
    })
  )

  console.log('Seeding complete!')
  console.log(`Created ${users.length} users`)
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
