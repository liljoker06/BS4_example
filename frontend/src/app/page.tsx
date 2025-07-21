'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllArticles } from '@/services/articleService'
import ArticleCard from '@/components/ArticleCard'
import { Article } from '@/types/article'
import { useSearch } from '@/context/SearchContext'
import CustomDatePicker from '@/components/CustomDatePicker'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { search } = useSearch()
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(6)

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    getAllArticles()
      .then(setArticles)
      .finally(() => setLoading(false))
  }, [])

  const filteredArticles = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary?.toLowerCase().includes(search.toLowerCase())

    const articleDate = new Date(a.date)
    const matchStart = startDate ? articleDate >= startDate : true
    const matchEnd = endDate ? articleDate <= endDate : true

    return matchSearch && matchStart && matchEnd
  })

  const totalPages = Math.ceil(filteredArticles.length / perPage)
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, perPage, startDate, endDate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <p className="text-gray-700 text-lg mb-4">
          Aucun article trouvé. Vous pouvez importer des articles pour commencer.
        </p>
        <button
          onClick={() => router.push('/import')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Importer des articles
        </button>
      </div>
    )
  }

  return (
    <div className="p-4">
{/* Pagination + Filtres */}
<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">

  {/* Infos & pagination */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
    <p className="text-gray-800 font-medium">
      {filteredArticles.length} article(s) trouvé(s)
    </p>

    <div className="flex items-center gap-2">
      <label className="text-sm">Articles par page :</label>
      <select
        value={perPage}
        onChange={(e) => setPerPage(Number(e.target.value))}
        className="border border-gray-300 px-3 py-1.5 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      >
        {[3, 6, 9, 12].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Filtres de dates */}
  <div className="flex flex-wrap gap-4 items-center">
    <div>
      <label className="text-sm block mb-1 text-gray-700">Date de début :</label>
      <CustomDatePicker value={startDate} onChange={setStartDate} />
    </div>
    <div>
      <label className="text-sm block mb-1 text-gray-700">Date de fin :</label>
      <CustomDatePicker value={endDate} onChange={setEndDate} />
    </div>
  </div>
</div>



      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedArticles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Précédent
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}