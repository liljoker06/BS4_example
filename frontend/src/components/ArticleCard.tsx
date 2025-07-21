'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types/article'

interface Props {
  article: Article
}

export default function ArticleCard({ article }: Props) {
  const encodedUrl = encodeURIComponent(article.url)

  return (
    <Link href={`/article/${encodedUrl}`}>
      <div className="border rounded-lg shadow p-4 flex flex-col justify-between cursor-pointer bg-white hover:shadow-md transition h-[350px]">
        {article.thumbnail && (
          <div className="relative w-full h-40 mb-2">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <h2 className="text-lg font-semibold line-clamp-2">{article.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {article.date} — {article.author}
          </p>
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{article.summary}</p>
        </div>
      </div>
    </Link>
  )
}
