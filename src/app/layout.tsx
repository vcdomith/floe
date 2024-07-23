import type { Metadata } from 'next'
import { Inter, Archivo } from 'next/font/google'
import localFont from 'next/font/local'
import './globalStyle.module.scss'
import SvgArray from '@/components/SvgArray/SvgArray'
// import './globals.css'
import '@/app/layout.scss'
import Container from '@/components/Container/Container'

const inter = Inter({ subsets: ['latin'] })
const archivo = Archivo({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  axes: ['wdth']
})
// const archivo = localFont({
//   src: [
//     {
//       path: '../../src/fonts/Archivo-Regular.ttf',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../../src/fonts/Archivo-Medium.ttf',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: '../../src/fonts/Archivo-SemiBold.ttf',
//       weight: '600',
//       style: 'normal',
//     },
//     {
//       path: '../../src/fonts/Archivo_SemiCondensed-SemiBold.ttf',
//       weight: '600c',
//       style: 'normal',
//     },
//     {
//       path: '../../src/fonts/Archivo-Bold.ttf',
//       weight: '700',
//       style: 'normal',
//     },
//   ]
// })
// const archivo = localFont({
//   src: [
//     {
//       path: '../../src/fonts/Archivo-VariableFont_wdth,wght.ttf',
//       weight: 'variable',
//       style: 'normal',
//       axes: ['wdth'],
//     },
//   ]
// })

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
        // className={archivo.className}
      >
        <SvgArray className='background'/>
        {/* <Container> */}
         {children}
        {/* </Container> */}
      </body>
    </html>
  )
}
