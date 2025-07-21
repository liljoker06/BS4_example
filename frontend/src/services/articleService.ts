import axios from 'axios'
import { Article } from '@/types/article'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
})

// GET /articles?category=...
export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  const res = await api.get<Article[]>(`/articles?category=${category}`)
  return res.data
}

// POST /articles
export const insertArticle = async (articleData: Article): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>('/articles', articleData)
  return res.data
}

// POST /scrape?url=...
export const scrapeOneArticle = async (url: string): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>(`/scrape?url=${encodeURIComponent(url)}`)
  return res.data
}

// POST /scrape/subcategory/range/...
export const scrapeRange = async (
  category: string,
  start: number,
  end: number,
  limit?: number
): Promise<{
  count: number
  titles: string[]
  urls: string[]
}> => {
  const query = `/scrape/category/range/${category}?start=${start}&end=${end}`
  const res = await api.post(query + (limit ? `&limit=${limit}` : ''))
  return res.data
}

// GET /articles
export const getAllArticles = async (): Promise<Article[]> => {
  try {
    const res = await api.get('/articles')
    console.log("Réponse reçue :", res.data)
    return res.data
  } catch (error) {
    console.error("Erreur Axios : ", error)
    throw error
  }
}
