interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export class NewsApiService {
  private static API_KEY_STORAGE_KEY = 'newsapi_api_key';
  private static BASE_URL = 'https://newsapi.org/v2';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('NewsAPI key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing NewsAPI key');
      const response = await fetch(`${this.BASE_URL}/top-headlines?country=us&pageSize=1&apiKey=${apiKey}`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Error testing NewsAPI key:', error);
      return false;
    }
  }

  static async fetchNews(category: string = 'general', searchQuery: string = '', pageSize: number = 20): Promise<{ success: boolean; error?: string; data?: NewsApiResponse }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'NewsAPI key not found' };
    }

    try {
      let url = `${this.BASE_URL}/top-headlines?pageSize=${pageSize}&apiKey=${apiKey}`;
      
      if (searchQuery.trim()) {
        // Use everything endpoint for search
        url = `${this.BASE_URL}/everything?q=${encodeURIComponent(searchQuery)}&pageSize=${pageSize}&sortBy=publishedAt&apiKey=${apiKey}`;
      } else {
        // Use top-headlines for categories
        if (category !== 'general') {
          url += `&category=${category}`;
        }
        url += '&country=us'; // Default to US news
      }

      console.log('Fetching news from NewsAPI:', url.replace(apiKey, '[API_KEY]'));
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'ok') {
        console.error('NewsAPI error:', data);
        return { 
          success: false, 
          error: data.message || 'Failed to fetch news from NewsAPI' 
        };
      }

      console.log('NewsAPI fetch successful:', data);
      return { 
        success: true,
        data: data 
      };
    } catch (error) {
      console.error('Error during NewsAPI fetch:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to NewsAPI' 
      };
    }
  }
}