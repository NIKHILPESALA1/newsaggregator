import { useState, useEffect } from 'react';
import { NewsApiService } from '@/utils/NewsApiService';
import type { Article } from '@/components/FeaturedArticle';

const transformNewsApiArticle = (apiArticle: any): Article => {
  return {
    title: apiArticle.title || 'Untitled Article',
    description: apiArticle.description || 'No description available',
    url: apiArticle.url,
    urlToImage: apiArticle.urlToImage || '',
    publishedAt: apiArticle.publishedAt,
    source: { name: apiArticle.source?.name || 'Unknown Source' },
    author: apiArticle.author || 'Staff Writer'
  };
};

export const useNewsApi = (category: string = 'general', searchQuery: string = '') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = NewsApiService.getApiKey();
      if (!apiKey) {
        setError('NewsAPI key not configured');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const result = await NewsApiService.fetchNews(category, searchQuery, 20);
        
        if (result.success && result.data) {
          const transformedArticles = result.data.articles
            .filter(article => article.title && article.url) // Filter out invalid articles
            .map(transformNewsApiArticle);
          
          if (transformedArticles.length === 0) {
            setError(searchQuery.trim() 
              ? `No articles found for "${searchQuery}". Try a different search term.`
              : 'No articles available in this category at the moment.'
            );
          }
          
          setArticles(transformedArticles);
        } else {
          setError(result.error || 'Failed to fetch news from NewsAPI');
        }
        
      } catch (err) {
        setError('Failed to fetch news. Please check your internet connection and try again.');
        console.error('NewsAPI fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, searchQuery]);

  return { articles, loading, error };
};