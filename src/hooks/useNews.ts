import { useState, useEffect } from 'react';
import type { Article } from '@/components/FeaturedArticle';

interface NewsResponse {
  articles: Article[];
  totalResults: number;
}

// Mock news data for demonstration
const mockArticles: Article[] = [
  {
    title: "Breaking: Major Tech Innovation Announced",
    description: "A groundbreaking advancement in artificial intelligence has been unveiled, promising to revolutionize the way we interact with technology in our daily lives.",
    url: "https://example.com/tech-innovation",
    urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: { name: "TechNews" },
    author: "Sarah Johnson"
  },
  {
    title: "Global Markets Show Strong Recovery",
    description: "International financial markets demonstrate resilience as key indicators point toward sustained economic growth across major economies.",
    url: "https://example.com/markets-recovery",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: { name: "Financial Times" },
    author: "Michael Chen"
  },
  {
    title: "Climate Summit Reaches Historic Agreement",
    description: "World leaders unite in unprecedented climate action plan, setting ambitious targets for carbon reduction and renewable energy adoption.",
    url: "https://example.com/climate-summit",
    urlToImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: { name: "Environmental Post" },
    author: "Dr. Emily Rodriguez"
  },
  {
    title: "Sports Championship Finals Draw Record Viewership",
    description: "The championship game attracts millions of viewers worldwide, breaking previous records and showcasing incredible athletic performances.",
    url: "https://example.com/sports-finals",
    urlToImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: { name: "Sports Central" },
    author: "Alex Turner"
  },
  {
    title: "Medical Breakthrough Offers New Hope",
    description: "Researchers announce a significant advancement in treatment protocols that could benefit millions of patients worldwide.",
    url: "https://example.com/medical-breakthrough",
    urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    source: { name: "Health Today" },
    author: "Dr. James Wilson"
  },
  {
    title: "Space Mission Achieves Remarkable Success",
    description: "Latest space exploration mission surpasses expectations, providing valuable scientific data and inspiring future expeditions.",
    url: "https://example.com/space-mission",
    urlToImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: { name: "Space News" },
    author: "Dr. Maria Gonzalez"
  }
];

const categoryArticles: Record<string, Article[]> = {
  general: mockArticles,
  business: mockArticles.filter(article => article.title.includes('Markets') || article.title.includes('Tech')),
  entertainment: [{
    title: "Movie Industry Celebrates Record-Breaking Year",
    description: "Box office numbers reach new heights as audiences return to theaters worldwide, with several blockbusters exceeding expectations.",
    url: "https://example.com/movie-industry",
    urlToImage: "https://images.unsplash.com/photo-1489599849896-11d6ba5b41bd?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: { name: "Entertainment Weekly" },
    author: "Jennifer Lee"
  }],
  health: mockArticles.filter(article => article.title.includes('Medical')),
  science: mockArticles.filter(article => article.title.includes('Space') || article.title.includes('Climate')),
  sports: mockArticles.filter(article => article.title.includes('Sports')),
  technology: mockArticles.filter(article => article.title.includes('Tech') || article.title.includes('Innovation'))
};

export const useNews = (category: string = 'general', searchQuery: string = '') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let filteredArticles = categoryArticles[category] || mockArticles;
        
        // Filter by search query if provided
        if (searchQuery.trim()) {
          filteredArticles = filteredArticles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setArticles(filteredArticles);
      } catch (err) {
        setError('Failed to fetch news. Please try again.');
        console.error('News fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, searchQuery]);

  return { articles, loading, error };
};