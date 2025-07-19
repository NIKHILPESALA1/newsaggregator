import { useState, useMemo, useEffect } from 'react';
import { NewsHeader } from '@/components/NewsHeader';
import { CategoryNav } from '@/components/CategoryNav';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { NewsCard } from '@/components/NewsCard';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { NewsApiKeySetup } from '@/components/NewsApiKeySetup';
import { useNews } from '@/hooks/useNews';
import { useFirecrawlNews } from '@/hooks/useFirecrawlNews';
import { useNewsApi } from '@/hooks/useNewsApi';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { NewsApiService } from '@/utils/NewsApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Zap, Newspaper } from 'lucide-react';
import newsHeroImage from '@/assets/news-hero.jpg';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataSource, setDataSource] = useState<'demo' | 'newsapi' | 'firecrawl'>('demo');
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [showNewsApiSetup, setShowNewsApiSetup] = useState(false);
  
  // Check available API keys and set default data source
  useEffect(() => {
    const newsApiKey = NewsApiService.getApiKey();
    const firecrawlApiKey = FirecrawlService.getApiKey();
    
    if (newsApiKey) {
      setDataSource('newsapi');
    } else if (firecrawlApiKey) {
      setDataSource('firecrawl');
    } else {
      setDataSource('demo');
    }
  }, []);
  
  // Use appropriate hook based on selected data source
  const mockNews = useNews(activeCategory, searchQuery);
  const firecrawlNews = useFirecrawlNews(activeCategory, searchQuery);
  const newsApiNews = useNewsApi(activeCategory, searchQuery);
  
  const { articles, loading, error } = 
    dataSource === 'newsapi' ? newsApiNews :
    dataSource === 'firecrawl' ? firecrawlNews : 
    mockNews;

  const featuredArticle = useMemo(() => {
    return articles.length > 0 ? articles[0] : null;
  }, [articles]);

  const regularArticles = useMemo(() => {
    return articles.slice(1);
  }, [articles]);

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-96 md:h-[500px] w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );

  const handleFirecrawlApiKeySet = () => {
    setDataSource('firecrawl');
    setShowApiSetup(false);
  };

  const handleNewsApiKeySet = () => {
    setDataSource('newsapi');
    setShowNewsApiSetup(false);
  };

  // Show API setup if requested
  if (showApiSetup) {
    return <ApiKeySetup onApiKeySet={handleFirecrawlApiKeySet} />;
  }

  if (showNewsApiSetup) {
    return <NewsApiKeySetup onApiKeySet={handleNewsApiKeySet} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <CategoryNav 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Data Source Control */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Data Source:</label>
                <Select value={dataSource} onValueChange={(value: 'demo' | 'newsapi' | 'firecrawl') => setDataSource(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="newsapi" disabled={!NewsApiService.getApiKey()}>
                      NewsAPI {!NewsApiService.getApiKey() && '(Setup Required)'}
                    </SelectItem>
                    <SelectItem value="firecrawl" disabled={!FirecrawlService.getApiKey()}>
                      Firecrawl {!FirecrawlService.getApiKey() && '(Setup Required)'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Badge variant={dataSource === 'demo' ? "secondary" : "default"} className="flex items-center space-x-1">
                {dataSource === 'newsapi' && <Newspaper className="h-3 w-3" />}
                {dataSource === 'firecrawl' && <Zap className="h-3 w-3" />}
                <span>
                  {dataSource === 'newsapi' ? 'NewsAPI' : 
                   dataSource === 'firecrawl' ? 'Firecrawl' : 'Demo Data'}
                </span>
              </Badge>
              
              <span className="text-sm text-muted-foreground">
                {dataSource === 'newsapi' ? 'Real-time news from NewsAPI.org' :
                 dataSource === 'firecrawl' ? 'Real-time news from major websites' : 
                 'Sample articles for demonstration'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {dataSource === 'newsapi' && !NewsApiService.getApiKey() && (
                <Button 
                  onClick={() => setShowNewsApiSetup(true)}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Newspaper className="h-3 w-3" />
                  <span>Setup NewsAPI</span>
                </Button>
              )}
              
              {dataSource === 'firecrawl' && !FirecrawlService.getApiKey() && (
                <Button 
                  onClick={() => setShowApiSetup(true)}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Zap className="h-3 w-3" />
                  <span>Setup Firecrawl</span>
                </Button>
              )}
              
              {dataSource === 'demo' && (
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowNewsApiSetup(true)}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Newspaper className="h-3 w-3" />
                    <span>Setup NewsAPI</span>
                  </Button>
                  <Button 
                    onClick={() => setShowApiSetup(true)}
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Zap className="h-3 w-3" />
                    <span>Setup Firecrawl</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img 
                src={newsHeroImage} 
                alt="News" 
                className="w-full h-48 object-cover rounded-lg mb-6 opacity-50"
              />
              <h2 className="text-2xl font-bold text-destructive mb-2">News Unavailable</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img 
                src={newsHeroImage} 
                alt="No results" 
                className="w-full h-48 object-cover rounded-lg mb-6 opacity-50"
              />
              <h2 className="text-2xl font-bold mb-2">No Articles Found</h2>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No articles found for "${searchQuery}". Try a different search term.`
                  : 'No articles available in this category at the moment.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {featuredArticle && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Featured Story</h2>
                <FeaturedArticle article={featuredArticle} />
              </section>
            )}

            {regularArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Latest News</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article, index) => (
                    <NewsCard key={index} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
