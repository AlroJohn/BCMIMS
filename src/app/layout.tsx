import './globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from 'next'
import { Providers } from '@/components/providers/theme-provider'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'Ctrl Alt Work Coworking Space',
  description: 'Ctrl Alt Work Coworking Space (CAW), launched in 2019, is the first coworking space in Legazpi City, Albay, designed to embody the aesthetics and functionality of a modern shared workspace.',
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
          <div className="h-screen" suppressHydrationWarning>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}