import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NewsApiService } from '@/utils/NewsApiService';
import { Eye, EyeOff, Key, ExternalLink } from 'lucide-react';

interface NewsApiKeySetupProps {
  onApiKeySet: () => void;
}

export const NewsApiKeySetup = ({ onApiKeySet }: NewsApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError(null);

    try {
      const isValid = await NewsApiService.testApiKey(apiKey);
      
      if (isValid) {
        NewsApiService.saveApiKey(apiKey);
        onApiKeySet();
      } else {
        setError('Invalid API key. Please check your key and try again.');
      }
    } catch (error) {
      setError('Failed to validate API key. Please check your internet connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleUseProvidedKey = () => {
    const providedKey = 'acb688eb983b44cebdcd212a8f163e72';
    setApiKey(providedKey);
    NewsApiService.saveApiKey(providedKey);
    onApiKeySet();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Setup NewsAPI Integration</CardTitle>
          <CardDescription>
            Connect to NewsAPI.org to get real-time news data from thousands of sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Button 
              onClick={handleUseProvidedKey}
              className="w-full"
              variant="default"
            >
              Use Provided API Key
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or enter your own
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">NewsAPI Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your NewsAPI key"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isValidating || !apiKey.trim()}
            >
              {isValidating ? 'Validating...' : 'Save & Continue'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Don't have a NewsAPI key?
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="text-sm"
            >
              <a 
                href="https://newsapi.org/register" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                Get Free API Key
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              Your API key is stored locally in your browser and is never sent to our servers.
              For production use, consider using environment variables or a secure backend.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};