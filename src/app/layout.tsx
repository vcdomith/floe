import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globalStyle.module.scss'
import SvgArray from '@/components/SvgArray/SvgArray'
// import './globals.css'
import '@/app/layout.scss'
import Container from '@/components/Container/Container'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Floe',
  description: 'Developed by DOMI studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        // className={inter.className}
      >
        <SvgArray className='background'/>
        {/* <Container> */}
         {children}
        {/* </Container> */}
      </body>
    </html>
  )
}
