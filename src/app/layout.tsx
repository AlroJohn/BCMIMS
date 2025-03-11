import './globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from 'next'
import { Providers } from '@/components/providers/theme-provider'
import NavbarWrapper from '@/components/custom/custom-ui/navbar-home-wrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Barangay Taysan, Legazpi City',
  description: 'The official website of Barangay Taysan, Legazpi City. Find information about officials, services, and contact details.',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-container antialiased" suppressHydrationWarning>
      <body 
        className={`${geistSans.className} ${geistMono.variable} text-foreground`} 
        data-theme="light"
        suppressHydrationWarning
      >
        <Providers>
          <NavbarWrapper /> {/* ✅ Navbar Logic Moved to a Client Component */}
          <div className="h-screen pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
