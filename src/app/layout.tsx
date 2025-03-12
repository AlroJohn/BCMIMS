import './globals.css'

import { Metadata } from 'next'
import { Providers } from '@/components/providers/theme-provider'

export const metadata: Metadata = {
  title: 'BCMIMS',
  description: 'The Barangay Taysan Chairperson Monitoring and Information Management System (CMIMS), serves Barangay Taysan, Legazpi City, Albay, providing an innovative platform for community governance, resident services, and information management.',
  icons: { icon: '/logo.png' }, // Update if a specific barangay logo exists
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-container antialiased" suppressHydrationWarning>
      <body 
        className={`text-foreground`} 
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