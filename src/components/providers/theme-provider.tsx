'use client'

import { ReactNode } from 'react'


import { Toaster } from 'sonner'
import { ThemeProvider } from '../custom/theme/theme-provider'
import { AuthProvider } from './auth-provider'

export function Providers({ children }: { children: ReactNode }) {

    return (
        <div className='h-screen'>


            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                <AuthProvider >
                    {children}
                </AuthProvider>
                <Toaster position="bottom-right" richColors closeButton theme="system" className="toaster-override" />
            </ThemeProvider>
        </div>
    )
}
