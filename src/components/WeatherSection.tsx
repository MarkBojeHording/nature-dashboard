
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pollution: {
    aqi: number;
    level: string;
  };
}

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

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 3),
        pollution: {
          aqi: Math.max(0, Math.min(200, prev.pollution.aqi + (Math.random() - 0.5) * 10)),
          level: prev.pollution.aqi < 50 ? 'Good' : prev.pollution.aqi < 100 ? 'Moderate' : 'Poor'
        }
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Sunny':
        return <Sun className="h-12 w-12 text-yellow-400" />;
      case 'Rainy':
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
      default:
        return 'text-red-400';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getWeatherIcon()}
          <span>Weather & Air Quality</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default WeatherSection;
