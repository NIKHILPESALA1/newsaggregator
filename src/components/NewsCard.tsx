import { ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Article } from './FeaturedArticle';

interface NewsCardProps {
  article: Article;
  onClick?: () => void;
}

export const NewsCard = ({ article, onClick }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(article.url, '_blank');
    }
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 shadow-card"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={article.urlToImage || '/placeholder.svg'} 
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 text-xs text-news-meta mb-2">
          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded font-medium">
            {article.source.name}
          </span>
          <Clock className="h-3 w-3" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        
        <h3 className="font-semibold text-sm md:text-base leading-tight mb-2 line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        {article.description && (
          <p className="text-sm text-news-meta line-clamp-2 mb-3">
            {article.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {article.author && (
            <span className="text-xs text-news-meta truncate">
              By {article.author}
            </span>
          )}
          <div className="flex items-center space-x-1 text-xs text-primary group-hover:text-primary-foreground transition-colors">
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};