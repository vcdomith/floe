import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globalStyle.module.scss'
import SvgArray from '@/components/SvgArray/SvgArray'
// import './globals.css'
import '@/app/layout.scss'
import Container from '@/components/Container/Container'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cálculo Tabelas',
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
        <SvgArray className='background' interval={2000}/>
        <Container>
         {children}
        </Container>
      </body>
    </html>
  )
}
