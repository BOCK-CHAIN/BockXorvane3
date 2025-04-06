import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Manrope, DM_Sans } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import './globals.css'
import { ThemeProvider } from '@/components/theme'
import ReactQueryProvider from '@/react-query'
import { ReduxProvider } from '@/redux/provider'
import { Toaster } from 'sonner'

const manrope = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WorkMan',
  description: 'Organize, Collaborate, and Store Videos with WorkMan',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`${manrope.className} bg-[#171717]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
                <Toaster />
              </ReactQueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>

  )
}
