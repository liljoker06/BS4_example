'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Article } from '@/types/article'
import { getAllArticles } from '@/services/articleService'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ArticleDetailPage() {
  const { encodedUrl } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllArticles()
      .then((articles) => {
        const found = articles.find((a) => encodeURIComponent(a.url) === encodedUrl)
        setArticle(found || null)
      })
      .finally(() => setLoading(false))
  }, [encodedUrl])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-[70vh] px-4 animate-pulse">
        <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="p-6 text-center text-red-600">
        Article introuvable.
        <br />
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">← Retour à l’accueil</Link>
      </div>
    )
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/" className="text-blue-600 underline mb-6 inline-block">← Retour</Link>

      <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {article.date} — {article.author}
      </p>

      {article.thumbnail && (
        <motion.img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-auto rounded-lg mb-6 shadow-md"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div
        className="prose dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.images.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article.images.map((img, i) => (
            <motion.img
              key={i}
              src={img}
              alt={`Image ${i + 1}`}
              className="rounded-lg shadow-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
