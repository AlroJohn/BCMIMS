// // prisma/seed.ts
// import { PrismaClient, UserRole, BookingStatus, BookingType, PaymentType, PaymentStatus } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { faker } from '@faker-js/faker';

// const prisma = new PrismaClient();

// // Utility function to insert data in batches
// async function batchInsert<T>(data: T[], batchSize: number, insertFunction: (batch: T[]) => Promise<void>) {
//   for (let i = 0; i < data.length; i += batchSize) {
//     const batch = data.slice(i, i + batchSize);
//     await insertFunction(batch);
//   }
// }

// // Ensure unique booking numbers
// let bookingCounter = 0;
// const generateBookingNumber = () => {
//   bookingCounter++;
//   return `BK-${Date.now()}-${bookingCounter}-${faker.string.numeric(4)}`;
// };

// async function main() {
//   console.log('Starting database seeding...');

//   // **Step 1: Cleaning existing data**
//   console.log('Cleaning existing data...');
//   await prisma.payment.deleteMany();
//   await prisma.booking.deleteMany();
//   await prisma.notification.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.space.deleteMany();

//   // **Step 2: Creating Spaces**
//   console.log('Creating spaces...');
//   const spaces = [
//     { name: 'Executive Meeting Room', description: 'Spacious meeting room...', capacity: 12, pricePerHour: 800, image: 'https://example.com/images/executive-meeting-room.jpg' },
//     { name: 'Small Meeting Room A', description: 'Intimate meeting space...', capacity: 6, pricePerHour: 400, image: 'https://example.com/images/small-meeting-room-a.jpg' },
//     { name: 'Private Office 1', description: 'Lockable private office...', capacity: 1, pricePerHour: 250, image: 'https://example.com/images/private-office-1.jpg' },
//     { name: 'Hot Desk Zone A', description: 'Open coworking space...', capacity: 20, pricePerHour: 100, image: 'https://example.com/images/hot-desk-a.jpg' },
//     { name: 'Event Hall', description: 'Large open space...', capacity: 50, pricePerHour: 1500, image: 'https://example.com/images/event-hall.jpg' },
//   ];

//   await prisma.space.createMany({ data: spaces, skipDuplicates: true });
//   const storedSpaces = await prisma.space.findMany({ select: { id: true, pricePerHour: true } });
//   console.log(`Created ${storedSpaces.length} spaces`);

//   // **Step 3: Creating Admin and Staff Users**
//   console.log('Creating admin and staff users...');
//   const customUsers = [
//     { name: 'admin', email: 'admin@cawork.ph', password: await bcrypt.hash('admin123', 10), phone: '+639171234567', role: UserRole.SUPERADMIN },
//     { name: 'staff 1', email: 'staff1@cawork.ph', password: await bcrypt.hash('staff123', 10), phone: '+639172345678', role: UserRole.STAFF },
//     { name: 'staff 2', email: 'staff2@cawork.ph', password: await bcrypt.hash('staff123', 10), phone: '+639173456789', role: UserRole.STAFF },
//     { name: 'test', email: 'test@cawork.ph', password: await bcrypt.hash('test123', 10), phone: '+639174567890', role: UserRole.CLIENT },
//   ];

//   await prisma.user.createMany({ data: customUsers, skipDuplicates: true });

//   // **Step 4: Creating Clients**
//   console.log('Creating clients...');
//   const clientPassword = await bcrypt.hash('client123', 10);
//   const clients = Array.from({ length: 200 }, () => {
//     const firstName = faker.person.firstName();
//     const lastName = faker.person.lastName();
//     return {
//       email: faker.internet.email({ firstName, lastName }),
//       password: clientPassword,
//       name: `${firstName} ${lastName}`,
//       phone: faker.phone.number({ style: 'national' }),
//       role: UserRole.CLIENT,
//     };
//   });

//   await batchInsert(clients, 50, async (batch) => {
//     await prisma.user.createMany({ data: batch });
//   });
//   const storedClients = await prisma.user.findMany({ where: { role: UserRole.CLIENT }, select: { id: true } });
//   console.log(`Created ${storedClients.length} clients`);

//   // **Step 5: Creating Bookings**
//   console.log('Creating bookings...');
//   const now = new Date();
//   const sixMonthsAgo = new Date();
//   sixMonthsAgo.setMonth(now.getMonth() - 6);
//   const threeMonthsAhead = new Date();
//   threeMonthsAhead.setMonth(now.getMonth() + 3);

//   const bookings = [];
//   for (let i = 0; i < 500; i++) {
//     const randomClient = faker.helpers.arrayElement(storedClients);
//     const randomSpace = faker.helpers.arrayElement(storedSpaces);

//     const startTime = faker.date.between({ from: sixMonthsAgo, to: threeMonthsAhead });
//     const endTime = new Date(startTime);
//     endTime.setHours(startTime.getHours() + faker.number.int({ min: 1, max: 8 }));

//     const bookingNumber = generateBookingNumber();

//     bookings.push({
//       bookingNumber,
//       userId: randomClient.id,
//       spaceId: randomSpace.id,
//       startTime,
//       endTime,
//       status: BookingStatus.CONFIRMED,
//       type: BookingType.SCHEDULED,
//     });
//   }

//   await batchInsert(bookings, 50, async (batch) => {
//     await prisma.booking.createMany({ data: batch });
//   });
//   const storedBookings = await prisma.booking.findMany({ select: { id: true, bookingNumber: true } });
//   console.log(`Created ${storedBookings.length} bookings`);

//   // **Step 6: Creating Payments**
//   console.log('Creating payments...');
//   const payments = [];
//   for (let i = 0; i < 500; i++) {
//     const relatedBooking = faker.helpers.arrayElement(storedBookings);
//     const randomClient = faker.helpers.arrayElement(storedClients);

//     const amount = Number(faker.number.int({ min: 500, max: 5000 }));

//     payments.push({
//       bookingId: relatedBooking.id,
//       userId: randomClient.id,
//       amount,
//       discountAmount: faker.number.int({ min: 0, max: Math.floor(amount) }),
//       type: faker.helpers.arrayElement([PaymentType.FULL_PAYMENT, PaymentType.RESERVATION_FEE]),
//       status: faker.helpers.arrayElement([PaymentStatus.PAID, PaymentStatus.PENDING]),
//       reference: `TR-${Date.now()}-${faker.string.alphanumeric(6).toUpperCase()}`,
//       processedBy: faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.7 }) ?? "SYSTEM",
//     });
//   }

//   await batchInsert(payments, 50, async (batch) => {
//     await prisma.payment.createMany({ data: batch });
//   });

//   console.log(`Created ${bookings.length} bookings`);
//   console.log(`Created ${payments.length} payments`);
//   console.log('Seeding complete!');
// }

// main()
//   .catch((e) => {
//     console.error('Error during seeding:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// prisma/seed.ts
import { PrismaClient, UserRole, BookingStatus, BookingType, PaymentType, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

const clientsToCreate: {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}[] = [];


const bookings: {
  bookingNumber: string;
  userId: string;
  spaceId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  type: BookingType;
}[] = [];

const payments: {
  bookingId: string;
  userId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  reference: string;
  processedBy: string;
  discountAmount: number;
}[] = [];

// Initialize Supabase client for Auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key to create users

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const prisma = new PrismaClient();

// Utility function to insert data in batches
async function batchInsert<T>(data: T[], batchSize: number, insertFunction: (batch: T[]) => Promise<void>) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await insertFunction(batch);
  }
}

// Ensure unique booking numbers
let bookingCounter = 0;
const generateBookingNumber = () => {
  bookingCounter++;
  return `BK-${Date.now()}-${bookingCounter}-${faker.string.numeric(4)}`;
};

async function main() {
  console.log('Starting database seeding...');

  // **Step 1: Cleaning existing data**
  console.log('Cleaning existing data from Prisma...');
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.space.deleteMany();

  // **Step 2: Creating Spaces**
  console.log('Creating spaces...');
  const spaces = [
    { name: 'Executive Meeting Room', description: 'Spacious meeting room...', capacity: 12, pricePerHour: 800, image: '/images/static/a2.png' },
    { name: 'Small Meeting Room A', description: 'Intimate meeting space...', capacity: 6, pricePerHour: 400, image: '/images/static/a3.png' },
    { name: 'Private Office 1', description: 'Lockable private office...', capacity: 1, pricePerHour: 250, image: '/images/static/a4.png' },
    { name: 'Hot Desk Zone A', description: 'Open coworking space...', capacity: 20, pricePerHour: 100, image: '/images/static/a5.png' },
    { name: 'Event Hall', description: 'Large open space...', capacity: 50, pricePerHour: 1500, image: '/images/static/a6.png' },
  ];

  await prisma.space.createMany({ data: spaces, skipDuplicates: true });
  const storedSpaces = await prisma.space.findMany({ select: { id: true, pricePerHour: true } });
  console.log(`Created ${storedSpaces.length} spaces`);

  // **Step 3: Creating Admin and Staff Users in Supabase Auth first, then in Prisma**
  console.log('Creating custom users in Supabase Auth and Prisma...');
  const customUsers = [
    { name: 'admin', email: 'admin@cawork.ph', password: 'admin123', phone: '+639171234567', role: UserRole.SUPERADMIN },
    { name: 'staff 1', email: 'staff1@cawork.ph', password: 'staff123', phone: '+639172345678', role: UserRole.STAFF },
    { name: 'staff 2', email: 'staff2@cawork.ph', password: 'staff123', phone: '+639173456789', role: UserRole.STAFF },
    { name: 'test', email: 'test@cawork.ph', password: 'test123', phone: '+639174567890', role: UserRole.CLIENT },
  ];

  // Create users in Supabase Auth and then in Prisma
  for (const user of customUsers) {
    try {
      // Check if user already exists in Supabase
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .limit(1);

      let userId;

      if (!existingUsers || existingUsers.length === 0) {
        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        });

        if (error) {
          console.error(`Error creating user ${user.email} in Supabase:`, error);
          continue;
        }

        userId = data.user.id;
        console.log(`Created user ${user.email} in Supabase Auth with ID: ${userId}`);
      } else {
        userId = existingUsers[0].id;
        console.log(`User ${user.email} already exists in Supabase Auth with ID: ${userId}`);
      }

      // Create or update user in Prisma
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          name: user.name,
          email: user.email,
          password: await bcrypt.hash(user.password, 10),
          phone: user.phone,
          role: user.role,
        },
        create: {
          id: userId,
          name: user.name,
          email: user.email,
          password: await bcrypt.hash(user.password, 10),
          phone: user.phone,
          role: user.role,
        },
      });

      console.log(`User ${user.email} created/updated in Prisma database`);
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
    }
  }

  // **Step 4: Creating Clients**
  console.log('Creating clients in Supabase Auth and Prisma...');
  const clientPassword = await bcrypt.hash('client123', 10);

  // Create fewer clients to avoid hitting rate limits
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = 'client123'; // Plain password for Auth

    try {
      // Create in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

      if (error) {
        console.error(`Error creating client ${email} in Supabase:`, error);
        continue;
      }

      const userId = data.user.id;
      console.log(`Created client ${email} in Supabase Auth with ID: ${userId}`);

      // Add to clients to create in Prisma
      clientsToCreate.push({
        id: userId,
        email: email,
        password: clientPassword, // Hashed password for Prisma
        name: `${firstName} ${lastName}`,
        phone: faker.phone.number({ style: 'national' }),
        role: UserRole.CLIENT,
      });
    } catch (error) {
      console.error(`Error creating client ${email}:`, error);
    }
  }

  // Create clients in Prisma
  await batchInsert(clientsToCreate, 10, async (batch) => {
    for (const client of batch) {
      await prisma.user.create({ data: client });
    }
  });

  const storedClients = await prisma.user.findMany({ where: { role: UserRole.CLIENT }, select: { id: true } });
  console.log(`Created ${storedClients.length} clients`);

  // **Step 5: Creating Bookings**
  // **Step 5: Creating Bookings**
  console.log('Creating bookings...');
  const now = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(now.getMonth() - 12);
  twelveMonthsAgo.setDate(1); // Start from the first day of the month

  const bookings: {
    bookingNumber: string;
    userId: string;
    spaceId: string;
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
    type: BookingType;
  }[] = [];

  for (let i = 0; i < 1000; i++) {
    const randomClient = faker.helpers.arrayElement(storedClients);
    const randomSpace = faker.helpers.arrayElement(storedSpaces);

    // Create a more even distribution across months
    // Distribute booking dates across all 12 months
    const randomMonth = faker.number.int({ min: 0, max: 11 });
    const bookingDate = new Date(twelveMonthsAgo);
    bookingDate.setMonth(twelveMonthsAgo.getMonth() + randomMonth);

    // Random day within the month
    const daysInMonth = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth() + 1,
      0
    ).getDate();
    bookingDate.setDate(faker.number.int({ min: 1, max: daysInMonth }));

    // Random hour
    bookingDate.setHours(
      faker.number.int({ min: 8, max: 20 }),
      faker.number.int({ min: 0, max: 59 })
    );

    // Create end time 1-8 hours after start time
    const startTime = new Date(bookingDate);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + faker.number.int({ min: 1, max: 8 }));

    // Ensure we don't create future bookings
    if (startTime > now) {
      // If this would be a future booking, adjust it to a past date
      const monthsBack = faker.number.int({ min: 0, max: 11 });
      startTime.setMonth(now.getMonth() - monthsBack);
      endTime.setMonth(now.getMonth() - monthsBack);
    }

    const bookingNumber = generateBookingNumber();

    // Create a more realistic distribution of booking types
    // 70% scheduled, 30% walk-in is a common split
    const bookingType = faker.helpers.weightedArrayElement([
      { value: BookingType.SCHEDULED, weight: 70 },
      { value: BookingType.WALKIN, weight: 30 }
    ]);

    // More realistic distribution of booking statuses
    const bookingStatus = faker.helpers.weightedArrayElement([
      { value: BookingStatus.COMPLETED, weight: 60 },
      { value: BookingStatus.CONFIRMED, weight: 20 },
      { value: BookingStatus.PENDING, weight: 10 },
      { value: BookingStatus.CANCELLED, weight: 8 },
    ]);

    bookings.push({
      bookingNumber,
      userId: randomClient.id,
      spaceId: randomSpace.id,
      startTime,
      endTime,
      status: bookingStatus,
      type: bookingType,
    });
  }

  // Create a summary of bookings by month and type for validation
  const summary = {};
  bookings.forEach(booking => {
    const monthKey = booking.startTime.toISOString().substring(0, 7); // YYYY-MM format
    if (!summary[monthKey]) {
      summary[monthKey] = { SCHEDULED: 0, WALKIN: 0 };
    }
    summary[monthKey][booking.type]++;
  });

  console.log('Booking distribution by month:');
  console.table(summary);

  await batchInsert(bookings, 10, async (batch) => {
    await prisma.booking.createMany({ data: batch });
  });
  const storedBookings = await prisma.booking.findMany({ select: { id: true, bookingNumber: true, userId: true } });
  console.log(`Created ${storedBookings.length} bookings`);
  // **Step 6: Creating Payments**
  console.log('Creating payments...');

  for (const booking of storedBookings) {
    if (faker.datatype.boolean(0.8)) { // 80% of bookings have payments
      const amount = Number(faker.number.int({ min: 500, max: 5000 }));

      payments.push({
        bookingId: booking.id,
        userId: booking.userId,
        amount,
        type: faker.helpers.arrayElement(Object.values(PaymentType)),
        status: faker.helpers.arrayElement(Object.values(PaymentStatus)),
        reference: `TR-${Date.now()}-${faker.string.alphanumeric(6).toUpperCase()}`,
        processedBy: faker.helpers.maybe(() => "admin@cawork.ph", { probability: 0.7 }) || "SYSTEM",
        discountAmount: faker.number.int({ min: 0, max: amount }),
      });
    }
  }

  await batchInsert(payments, 10, async (batch) => {
    await prisma.payment.createMany({ data: batch });
  });

  console.log(`Created ${payments.length} payments`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });