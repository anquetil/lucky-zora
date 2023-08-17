import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';

//import { Inter } from 'next/font/google'
import { Archivo_Narrow } from 'next/font/google'
import { Providers } from './providers';
const mainfont = Archivo_Narrow({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "I'm Feeling Lucky",
  description: 'A fun minting tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
   return (
      <html lang="en">
         <body className={mainfont.className}>
            <Providers>
               {children}
            </Providers>
            <Analytics />
         </body>
      </html>
   );
}
