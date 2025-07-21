// app/article/[encodedUrl]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Article } from '@/types/article'
import { getAllArticles } from '@/services/articleService'
import Link from 'next/link'

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
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
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
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-blue-600 underline mb-4 inline-block">← Retour</Link>
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{article.date} — {article.author}</p>

      {article.thumbnail && (
        <img src={article.thumbnail} alt={article.title} className="w-full h-auto rounded mb-6" />
      )}

      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

      {article.images.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article.images.map((img, i) => (
            <img key={i} src={img} alt={`Image ${i + 1}`} className="rounded shadow" />
          ))}
        </div>
      )}
    </div>
  )
}
