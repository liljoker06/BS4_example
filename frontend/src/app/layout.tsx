import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { SearchProvider } from '@/context/SearchContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Scraper BDM',
  description: 'Articles scrappés depuis le Blog du Modérateur',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SearchProvider>
          <Navbar />
          <main>{children}</main>
        </SearchProvider>
      </body>
    </html>
  )
}