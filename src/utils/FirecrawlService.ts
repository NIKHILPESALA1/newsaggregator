import axios from 'axios';

export class FirecrawlService {
  private static readonly API_KEY = 'fc-47fa9d400e094988913a3400f037bd44n';
  private static readonly BASE_URL = 'https://api.firecrawl.dev/v1/scrape';

  public static async scrapeNewsWebsite(url: string): Promise<{ success: boolean; data: any }> {
  try {
    const response = await axios.post(
      'http://localhost:5000/scrape', // Now goes through your backend
      { url }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Firecrawl scrape error:', error);
    return { success: false, data: null };
  }
}


  public static getApiKey() {
    return this.API_KEY;
  }

  public static getNewsWebsites() {
    return [
      {
        name: 'TOI India',
        url: 'https://timesofindia.indiatimes.com/india',
        category: 'general'
      },
      {
        name: 'TOI Tech',
        url: 'https://timesofindia.indiatimes.com/technology',
        category: 'technology'
      },
      {
        name: 'TOI World',
        url: 'https://timesofindia.indiatimes.com/world',
        category: 'world'
      }
    ];
  }
}
