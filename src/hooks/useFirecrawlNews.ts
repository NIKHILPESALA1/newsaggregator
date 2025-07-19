// src/hooks/useFirecrawlNews.ts
import { useState, useEffect } from 'react';
import { FirecrawlService } from '@/utils/FirecrawlService';
import type { Article } from '@/components/FeaturedArticle';

const extractArticleFromScrapedData = (scrapedData: any, sourceUrl: string): Article | null => {
  try {
    const metadata = scrapedData?.metadata || {};
    const content = scrapedData?.content;

    if (!metadata && !content) {
      console.warn('No metadata or content found for:', sourceUrl);
      return null;
    }

    const title =
      metadata.ogTitle || metadata.title || content?.split('\n')[0]?.substring(0, 80) || 'Untitled Article';

    let description = metadata.ogDescription || metadata.description || '';
    if (!description && content) {
      const paragraphs = content.split('\n').filter(
        (line: string) => line.trim().length > 50 && !line.startsWith('#') && !line.startsWith('*')
      );
      description = paragraphs[0]?.substring(0, 200) + '...' || '';
    }

    const urlToImage = metadata.ogImage || '';
    const publishedAt = new Date().toISOString();

    const url = new URL(sourceUrl);
    const sourceName = url.hostname.replace('www.', '').split('.')[0];

    return {
      title,
      description,
      url: sourceUrl,
      urlToImage,
      publishedAt,
      source: { name: sourceName.charAt(0).toUpperCase() + sourceName.slice(1) },
      author: 'Staff Writer',
    };
  } catch (error) {
    console.error('Error extracting article data:', error);
    return null;
  }
};



export const useFirecrawlNews = (category: string = 'general', searchQuery: string = '') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = FirecrawlService.getApiKey();
      if (!apiKey) {
        setError('Firecrawl API key not configured');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const newsWebsites = FirecrawlService.getNewsWebsites();
        let targetWebsites = newsWebsites;

        if (category !== 'general') {
          targetWebsites = newsWebsites.filter(site => site.category === category);
        }

        if (targetWebsites.length === 0) {
          targetWebsites = newsWebsites.filter(site => site.category === 'general');
        }

        const selectedWebsites = targetWebsites.slice(0, Math.min(4, targetWebsites.length));

        console.log(`Scraping ${selectedWebsites.length} websites for category: ${category}`);

        const scrapePromises = selectedWebsites.map(async (website) => {
          try {
            const result = await FirecrawlService.scrapeNewsWebsite(website.url);
            if (result.success && result.data) {
              return extractArticleFromScrapedData(result.data, website.url);
            }
            return null;
          } catch (error) {
            console.error(`Error scraping ${website.name}:`, error);
            return null;
          }
        });

        const scrapedArticles = await Promise.all(scrapePromises);
        const validArticles = scrapedArticles.filter((article): article is Article => article !== null);

        let filteredArticles = validArticles;
        if (searchQuery.trim()) {
          filteredArticles = validArticles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (filteredArticles.length === 0 && searchQuery.trim()) {
          setError(`No articles found for "${searchQuery}". Try a different search term.`);
        } else if (filteredArticles.length === 0) {
          setError('No articles could be scraped at this time. Please try again later.');
        }

        setArticles(filteredArticles);

      } catch (err) {
        setError('Failed to fetch news. Please check your internet connection and try again.');
        console.error('News fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, searchQuery]);

  return { articles, loading, error };
};
