'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSearch } from '@/context/SearchContext'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { search, setSearch } = useSearch()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600 hover:opacity-80 transition">Scraper BDM</span>
        </Link>

        {/* Search bar visible uniquement sur la Home */}
        {isHome && (
          <div className="relative w-1/2 max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        )}

        {/* Bouton Importer */}
        <Link href="/import">
          <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Importer
          </button>
        </Link>
      </div>
    </nav>
  )
}
