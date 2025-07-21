'use client'
import { useEffect, useState } from 'react'
import { getAllArticles } from '@/services/articleService'
import ArticleCard from '@/components/ArticleCard'
import { Article } from '@/types/article'
import { useSearch } from '@/context/SearchContext'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { search } = useSearch()

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    getAllArticles()
      .then(setArticles)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {filteredArticles.length === 0 ? (
        <p className="text-gray-700">Aucun article trouvé.</p>
      ) : (
        filteredArticles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))
      )}
    </div>
  )
}
