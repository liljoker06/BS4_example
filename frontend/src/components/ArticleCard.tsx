'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const encodedUrl = encodeURIComponent(article.url);

  return (
    <Link href={`/article/${encodedUrl}`}>
      <div className="border rounded-lg shadow p-4 flex flex-col cursor-pointer bg-white hover:shadow-md transition">
        {article.thumbnail && (
          <div className="relative w-full h-40 mb-2">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />
          </div>
        )}
        <h2 className="text-lg font-semibold">{article.title}</h2>
        <p className="text-sm text-gray-500">{article.date} — {article.author}</p>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3">{article.summary}</p>
      </div>
    </Link>
  );
}
