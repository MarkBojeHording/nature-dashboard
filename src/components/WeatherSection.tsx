
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, AlertCircle } from 'lucide-react';
import { weatherService, WeatherData } from '../services/weatherService';
import ApiKeyInput from './ApiKeyInput';

const WeatherSection = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    visibility: 10,
    pollution: {
      aqi: 45,
      level: 'Good'
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(weatherService.hasApiKey());

  const fetchWeatherData = async () => {
    if (!weatherService.hasApiKey()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await weatherService.getCurrentLocationWeather();
      setWeather(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySet = (apiKey: string) => {
    weatherService.setApiKey(apiKey);
    setHasApiKey(true);
    fetchWeatherData();
  };

  useEffect(() => {
    if (hasApiKey) {
      fetchWeatherData();
      
      // Update weather data every 10 minutes
      const interval = setInterval(fetchWeatherData, 600000);
      return () => clearInterval(interval);
    }
  }, [hasApiKey]);

  if (!hasApiKey) {
    return (
      <ApiKeyInput 
        onApiKeySet={handleApiKeySet}
        currentApiKey={weatherService.getApiKey()}
      />
    );
  }

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Clear':
        return <Sun className="h-12 w-12 text-yellow-400" />;
      case 'Rain':
      case 'Drizzle':
        return <CloudRain className="h-12 w-12 text-blue-400" />;
      default:
        return <Cloud className="h-12 w-12 text-gray-300" />;
    }
  };

  const getPollutionColor = (level: string) => {
    switch (level) {
      case 'Good':
        return 'text-green-400';
      case 'Moderate':
        return 'text-yellow-400';
      case 'Unhealthy for Sensitive Groups':
        return 'text-orange-400';
      case 'Unhealthy':
      case 'Very Unhealthy':
      case 'Hazardous':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getWeatherIcon()}
          <span>Weather & Air Quality</span>
          {isLoading && (
            <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="flex items-center space-x-2 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="text-4xl font-bold">{Math.round(weather.temperature)}°C</div>
              <div className="text-lg text-gray-200">{weather.condition}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Humidity: {Math.round(weather.humidity)}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-gray-300" />
                <span className="text-sm">Wind: {Math.round(weather.windSpeed)} km/h</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-300" />
                <span className="text-sm">Visibility: {weather.visibility} km</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${getPollutionColor(weather.pollution.level).replace('text-', 'bg-')}`} />
                <span className="text-sm">AQI: {Math.round(weather.pollution.aqi)}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-black/20 rounded-lg">
              <div className="text-sm font-medium">Air Quality</div>
              <div className={`text-lg font-bold ${getPollutionColor(weather.pollution.level)}`}>
                {weather.pollution.level}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherSection;
