'use client'

import { useState } from 'react'
import { scrapeOneArticle, scrapeRange } from '@/services/articleService'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLink, FiList, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi'
import { FaSpinner } from 'react-icons/fa'
import { RiLinksFill } from "react-icons/ri";

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
      <motion.h1
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Importation d’articles
      </motion.h1>

      <AnimatePresence mode="wait">
        {!mode && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <motion.button
              onClick={() => setMode('single')}
              className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLink />
              Scraper un article
            </motion.button>
            <motion.button
              onClick={() => setMode('range')}
              className="flex items-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiList />
              Scraper une sous-catégorie
            </motion.button>
          </motion.div>
        )}

        {mode === 'single' && (
          <motion.div
            key="single"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="bg-white  p-6 mt-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">🔗 Scraper un article précis</h2>
            <span className="text-gray-600 mb-2 block">
              voici le liens du site à scraper :
              <a
                href="https://www.blogdumoderateur.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <RiLinksFill className="inline-block mr-1" />
                www.blogdumoderateur.com
              </a>
            </span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL de l’article à scraper"
              className="w-full px-4 py-2 border border-gray-300  bg-gray-50  text-gray-900  rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={handleSingleScrape}
                disabled={loading || !url}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : null}
                {loading ? 'Importation...' : 'Importer'}
              </button>

              <button
                onClick={() => setMode(null)}
                className="text-sm text-gray-500 hover:underline flex items-center gap-1"
              >
                <FiArrowLeft />
                Revenir au choix
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'range' && (
          <motion.div
            key="range"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="bg-white  p-6 mt-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">📚 Scraper une plage d’articles</h2>
            <span className="text-gray-600 mb-2 block">
              voici le liens du site à scraper :
              <a
                href="https://www.blogdumoderateur.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <RiLinksFill className="inline-block mr-1" />
                www.blogdumoderateur.com
              </a>
            </span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Sous-catégorie (ex: intelligence-artificielle)"
              className="w-full px-4 py-2 border rounded mb-4 "
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                type="number"
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value))}
                placeholder="Page de début"
                className="px-4 py-2 border rounded "
                min={1}
              />
              <input
                type="number"
                value={endPage}
                onChange={(e) => setEndPage(Number(e.target.value))}
                placeholder="Page de fin"
                className="px-4 py-2 border rounded "
                min={startPage}
              />
              <input
                type="number"
                value={limit === '' ? '' : limit}
                onChange={(e) => setLimit(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Limite (optionnel)"
                className="px-4 py-2 border rounded "
                min={1}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleRangeScrape}
                disabled={loading || !category}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : null}
                {loading ? 'Importation...' : 'Importer'}
              </button>
              <button
                onClick={() => setMode(null)}
                className="text-sm text-gray-500 hover:underline flex items-center gap-1"
              >
                <FiArrowLeft />
                Revenir au choix
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(message || error) && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message && (
            <p className="text-green-600 font-medium flex items-center justify-center gap-2">
              <FiCheckCircle />
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 font-medium flex items-center justify-center gap-2">
              <FiAlertCircle />
              {error}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
