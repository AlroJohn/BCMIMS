## kung muya nindo pnpm gamiton:
## pnpm i
## pnpm add -D prisma
## pnpm prisma generate
## pnpm prisma migrate dev 

## if bako pedi ini
  `npx prisma generate`
  `npx prisma migrate dev` // `npx prisma db push`
  `npx prisma studio`


- setup ORM and Supabase
  - install prisma (`npm install @prisma/client`)
  - setup prisma (env setup)
  - run migrations (`npx prisma db push`)
  - run dev migration (`npx prisma migrate dev`)
  - see prisma db (`npx prisma studio`)
- auth setup (todo)

Reset DB `pnpm prisma db push --force-reset` and `pnpm prisma db seed`


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## structure
src/
├── app/
│   ├── api/                           # API routes
│   │   ├── auth/                      # Authentication endpoints
│   │   │   ├── [...nextauth]/         # NextAuth configuration
│   │   │   ├── register/              # Client registration
│   │   │   └── route.js               # Main auth routes
│   │   ├── bookings/                  # Booking management
│   │   │   ├── route.js               # Bookings CRUD
│   │   │   ├── [id]/                  # Individual booking operations
│   │   │   │   └── route.js
│   │   │   └── availability/          # Check space availability
│   │   │       └── route.js
│   │   ├── payments/                  # Payment handling
│   │   │   └── route.js
│   │   ├── spaces/                    # Coworking spaces/rooms
│   │   │   └── route.js
│   │   ├── users/                     # User management (for admin)
│   │   │   └── route.js
│   │   └── sms/                       # SMS notification service
│   │       └── route.js
│   │
│   ├── auth/                          # Authentication pages
│   │   ├── signin/                    # Login page
│   │   │   └── page.js
│   │   ├── signup/                    # Registration page
│   │   │   └── page.js
│   │   └── forgot-password/           # Password recovery
│   │       └── page.js
│   │
│   ├── dashboard/                     # Client dashboard
│   │   ├── layout.js                  # Client dashboard layout
│   │   ├── page.js                    # Main dashboard
│   │   ├── bookings/                  # Client bookings
│   │   │   ├── page.js                # Booking history
│   │   │   └── [id]/                  # Booking details
│   │   │       └── page.js
│   │   ├── profile/                   # User profile
│   │   │   └── page.js
│   │   └── new-booking/               # Make new reservation
│   │       └── page.js
│   │
│   ├── admin/                         # Admin/Staff portal
│   │   ├── layout.js                  # Admin layout
│   │   ├── page.js                    # Admin dashboard
│   │   ├── bookings/                  # Booking management
│   │   │   ├── page.js                # All bookings
│   │   │   └── [id]/                  # Manage booking
│   │   │       └── page.js
│   │   ├── spaces/                    # Space management
│   │   │   ├── page.js                # All spaces
│   │   │   ├── add/                   # Add new space
│   │   │   │   └── page.js
│   │   │   └── [id]/                  # Edit space
│   │   │       └── page.js
│   │   ├── users/                     # User management (superadmin only)
│   │   │   ├── page.js                # User list
│   │   │   └── [id]/                  # User details
│   │   │       └── page.js
│   │   ├── payments/                  # Payment processing
│   │   │   └── page.js
│   │   └── settings/                  # System settings
│   │       └── page.js                # Configuration
│   │
│   ├── layout.js                      # Root layout
│   └── page.js                        # Landing page
│
├── components/                        # Reusable components
│   ├── ui/                            # UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Calendar.jsx               # For booking dates/times
│   ├── auth/                          # Auth components
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── booking/                       # Booking components
│   │   ├── BookingForm.jsx
│   │   ├── SpaceCard.jsx
│   │   └── AvailabilityChecker.jsx
│   └── admin/                         # Admin components
│       ├── BookingTable.jsx
│       ├── PaymentProcessor.jsx
│       └── UserManagement.jsx
│
├── lib/                               # Utility functions
│   ├── prisma.js                      # Prisma client
│   ├── auth.js                        # Auth utilities
│   ├── sms.js                         # SMS service integration
│   └── utils.js                       # Helper functions
│
├── hooks/                             # Custom React hooks
│   ├── useAuth.js
│   ├── useBookings.js
│   └── useSpaces.js
│
├── config/                            # Configuration
│   └── settings.js                    # App settings
│
├── middleware.js                      # Next.js middleware for auth
│
└── prisma/                            # Prisma ORM
    ├── schema.prisma                  # Your data model
    └── migrations/                    # Database migrations