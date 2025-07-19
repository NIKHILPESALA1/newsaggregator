import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  color?: string;
}

const categories: Category[] = [
  { id: 'general', name: 'General' },
  { id: 'business', name: 'Business' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' }
];

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export const CategoryNav = ({ activeCategory, onCategoryChange, className }: CategoryNavProps) => {
  return (
    <nav className={cn("bg-card border-b border-border", className)}>
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto py-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200",
                "hover:bg-news-hover",
                activeCategory === category.id 
                  ? "bg-news-category text-primary-foreground shadow-sm" 
                  : "text-news-meta hover:text-foreground"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};