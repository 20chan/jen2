import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local';
import Link from 'next/link';
import AuthProvider from './providers/AuthProvider';
import './globals.css'
import { AuthProxy } from '@/components/AuthProxy';

const inter = Inter({ subsets: ['latin'] })

const mono = localFont({
  src: [
    {
      path: '../fonts/iosevka-ss04-medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/iosevka-ss04-semibold.woff2',
      weight: '600',
      style: 'semibold',
    },
    {
      path: '../fonts/iosevka-ss04-bold.woff2',
      weight: '700',
      style: 'semibold',
    },
  ],
  display: 'block',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Jen2',
  description: 'Not a just answering machine',
  themeColor: '#282c34',
  colorScheme: 'dark',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mono.className}>
        <AuthProvider>
          <div className='sticky top-0 bg-half-key p-4 py-1 flex justify-center items-stretch'>
            <div className='max-w-4xl mr-4'>
              <div className='text-xl font-bold'>
                <span>Jen</span><span className='text-half-red'>2</span>
              </div>
            </div>
            <div className='flex-1'>
              <Link href='/dashboard'>
                <div className='text-xl font-bold'>
                  Dashboard
                </div>
              </Link>
            </div>
            <div>
              <AuthProxy fallback={<Link href='/api/auth/signin'>Login</Link>}>
                <Link href='/api/auth/signout'>
                  Logout
                </Link>
              </AuthProxy>

            </div>
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
