export interface Article {
  url: string;
  title: string;
  thumbnail?: string;
  categories?: string;
  summary?: string;
  date?: string;
  author?: string;
  content: string;
  images: string[];
}
