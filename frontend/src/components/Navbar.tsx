// components/Navbar.tsx
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSearch } from '@/context/SearchContext'

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { search, setSearch } = useSearch()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">Scraper BDM</h1>

      {isHome && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un article..."
          className="border px-3 py-1 rounded w-1/2"
        />
      )}

      <Link href="/import">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Importer
        </button>
      </Link>
    </nav>
  )
}
