'use client'
import { useState } from 'react'
import { scrapeOneArticle, scrapeRange } from '@/services/articleService'

export default function ImportPage() {
  const [mode, setMode] = useState<'single' | 'range' | null>(null)
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [startPage, setStartPage] = useState(1)
  const [endPage, setEndPage] = useState(1)
  const [limit, setLimit] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const resetFeedback = () => {
    setMessage(null)
    setError(null)
  }

  const handleSingleScrape = async () => {
    resetFeedback()
    setLoading(true)
    try {
      const res = await scrapeOneArticle(url)
      setMessage(res.message)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors du scraping.')
    } finally {
      setLoading(false)
    }
  }

  const handleRangeScrape = async () => {
    resetFeedback()
    setLoading(true)
    try {
      const res = await scrapeRange(category, startPage, endPage, limit || undefined)
      setMessage(`${res.count} articles importés.`)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors de l’import.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Importation d’articles</h1>

      {/* Choix du mode */}
      {!mode && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('single')}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Scraper un article
          </button>
          <button
            onClick={() => setMode('range')}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Scraper une sous-catégorie
          </button>
        </div>
      )}

      {/* Formulaire dynamique */}
      {mode === 'single' && (
        <div className="bg-white  p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔗 Scraper un article précis</h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL de l’article à scraper"
            className="w-full px-4 py-2 border rounded mb-4"
          />
          <div className="flex justify-between items-center">
            <button
              onClick={handleSingleScrape}
              disabled={loading || !url}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Importation...' : 'Importer'}
            </button>
            <button
              onClick={() => setMode(null)}
              className="text-sm text-gray-500 hover:underline"
            >
              ← Revenir au choix
            </button>
          </div>
        </div>
      )}

      {mode === 'range' && (
        <div className="bg-white  p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📚 Scraper une plage d’articles</h2>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Sous-catégorie (ex: intelligence-artificielle)"
            className="w-full px-4 py-2 border rounded mb-4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="number"
              value={startPage}
              onChange={(e) => setStartPage(Number(e.target.value))}
              placeholder="Page de début"
              className="px-4 py-2 border rounded"
              min={1}
            />
            <input
              type="number"
              value={endPage}
              onChange={(e) => setEndPage(Number(e.target.value))}
              placeholder="Page de fin"
              className="px-4 py-2 border rounded"
              min={startPage}
            />
            <input
              type="number"
              value={limit === '' ? '' : limit}
              onChange={(e) => setLimit(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Limite (optionnel)"
              className="px-4 py-2 border rounded"
              min={1}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleRangeScrape}
              disabled={loading || !category}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Importation...' : 'Importer'}
            </button>
            <button
              onClick={() => setMode(null)}
              className="text-sm text-gray-500 hover:underline"
            >
              ← Revenir au choix
            </button>
          </div>
        </div>
      )}

      {(message || error) && (
        <div className="mt-6 text-center">
          {message && <p className="text-green-600 font-medium">{message}</p>}
          {error && <p className="text-red-600 font-medium">{error}</p>}
        </div>
      )}
    </div>
  )
}
