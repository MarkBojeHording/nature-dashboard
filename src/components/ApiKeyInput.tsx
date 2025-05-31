
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');

  const handleSave = () => {
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-6 w-6" />
          <span>Weather API Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-200">
          <p>To get real weather and air quality data, you need an OpenWeatherMap API key.</p>
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-blue-300 hover:text-blue-200 mt-2"
          >
            <span>Get your free API key here</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your OpenWeatherMap API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
          />
          <Button 
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Save API Key
          </Button>
        </div>

        {currentApiKey && (
          <div className="text-xs text-gray-300 mt-2">
            API key saved. Weather data will update automatically.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
