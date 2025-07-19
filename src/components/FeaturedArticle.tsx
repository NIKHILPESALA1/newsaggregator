import { ExternalLink, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author?: string;
}

interface FeaturedArticleProps {
  article: Article;
}

export const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="relative overflow-hidden group cursor-pointer shadow-feature hover:shadow-xl transition-all duration-300">
      <div className="relative h-96 md:h-[500px]">
        <img 
          src={article.urlToImage || '/placeholder.svg'} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-feature" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-news-feature">
          <div className="flex items-center space-x-2 text-sm mb-3 text-primary-foreground/80">
            <span className="bg-primary px-2 py-1 rounded text-xs font-medium">
              {article.source.name}
            </span>
            <Clock className="h-3 w-3" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-4 line-clamp-3">
            {article.description}
          </p>
          
          <div className="flex items-center justify-between">
            {article.author && (
              <span className="text-sm text-primary-foreground/70">
                By {article.author}
              </span>
            )}
            <div className="flex items-center space-x-1 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <span>Read more</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};