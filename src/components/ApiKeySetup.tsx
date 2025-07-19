import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { FirecrawlService } from '@/utils/FirecrawlService';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsTestingKey(true);
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setIsKeyValid(true);
        toast({
          title: "Success!",
          description: "Firecrawl API key validated and saved",
          duration: 3000,
        });
        setTimeout(() => {
          onApiKeySet();
        }, 1000);
      } else {
        setIsKeyValid(false);
        toast({
          title: "Invalid API Key",
          description: "Please check your Firecrawl API key and try again",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      setIsKeyValid(false);
      toast({
        title: "Error",
        description: "Failed to validate API key",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Setup Firecrawl API</CardTitle>
          <CardDescription>
            Enter your Firecrawl API key to enable real-time news scraping
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🔒 Recommended: Use Supabase
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              For better security, connect your project to Supabase and store your API key securely.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-700 border-blue-300 hover:bg-blue-100 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/20"
              onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Setup Supabase
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                Firecrawl API Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setIsKeyValid(null);
                  }}
                  placeholder="pub_..."
                  className="pr-10"
                  required
                />
                {isKeyValid === true && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {isKeyValid === false && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from{" "}
                <a 
                  href="https://www.firecrawl.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  firecrawl.dev
                </a>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isTestingKey || !apiKey.trim()}
              className="w-full"
            >
              {isTestingKey ? "Validating..." : "Save & Continue"}
            </Button>
          </form>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>What you'll get:</span>
              <Badge variant="secondary" className="text-xs">Live Data</Badge>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Real-time news from major websites</li>
              <li>• BBC, Reuters, TechCrunch, ESPN & more</li>
              <li>• Fresh content updated automatically</li>
              <li>• Better search and categorization</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};