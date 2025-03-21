import { PrismaClient, UserRole } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { sub } from 'date-fns'

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

  // Create Users
  const customUsersData = [
    { name: 'Admin User', email: 'admin@example.com', password: 'test', phone: '+639630305154', role: UserRole.Admin, subRole: false },
    { name: 'Education User', email: 'education@example.com', password: 'test', phone: '+639123456789', role: UserRole.Education, subRole: false },
    { name: 'Environment User', email: 'environment@example.com', password: 'test', phone: '+639987654321', role: UserRole.Environment, subRole: false },
    { name: 'Finance User', email: 'finance@example.com', password: 'test', phone: '+639112233445', role: UserRole.Finance, subRole: false },
    { name: 'Health Services User', email: 'healthservices@example.com', password: 'test', phone: '+639556677889', role: UserRole.HealthServices, subRole: false },
    { name: 'Peace Order User', email: 'peaceorder@example.com', password: 'test', phone: '+639998877665', role: UserRole.PeaceOrder, subRole: false },
    { name: 'Public Works User', email: 'publicworks@example.com', password: 'test', phone: '+639334455667', role: UserRole.PublicWorks, subRole: false },
    { name: 'Women User', email: 'women@example.com', password: 'test', phone: '+639776655443', role: UserRole.Women, subRole: false },
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
          subRole: user.subRole, // Add this line to include the subRole field
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