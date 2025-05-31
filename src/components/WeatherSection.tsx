import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from 'lucide-react';
import { getWeatherByCoords, WeatherData as WeatherDataType } from '@/services/weatherService';
import { getPollutionByCoords, getAQIDescription, PollutionData } from '@/services/pollutionService';

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
  city: string;
}

const WeatherSection = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    condition: 'Loading...',
    humidity: 0,
    windSpeed: 0,
    visibility: 0,
    pollution: {
      aqi: 0,
      level: 'Loading...'
    },
    city: 'Loading...'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const [weatherData, pollutionData] = await Promise.all([
        getWeatherByCoords(lat, lon),
        getPollutionByCoords(lat, lon)
      ]);

      setWeather({
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        visibility: weatherData.visibility / 1000, // Convert to km
        pollution: {
          aqi: pollutionData.list[0].main.aqi,
          level: getAQIDescription(pollutionData.list[0].main.aqi)
        },
        city: weatherData.name
      });
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user's location and fetch weather data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }

    // Refresh data every 30 minutes
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherData(position.coords.latitude, position.coords.longitude);
          },
          (error) => console.error('Error refreshing weather data:', error)
        );
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-12 w-12 text-yellow-400" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-12 w-12 text-blue-400" />;
      default:
        return <Cloud className="h-12 w-12 text-gray-300" />;
    }
  };

  const getPollutionColor = (level: string) => {
    switch (level) {
      case 'Good':
        return 'text-green-400';
      case 'Fair':
        return 'text-green-300';
      case 'Moderate':
        return 'text-yellow-400';
      case 'Poor':
        return 'text-orange-400';
      case 'Very Poor':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle>Loading weather data...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-red-400">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

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
          <div className="text-sm text-gray-300">{weather.city}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-400" />
            <span className="text-sm">Humidity: {Math.round(weather.humidity)}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-300" />
            <span className="text-sm">Wind: {Math.round(weather.windSpeed)} m/s</span>
          </div>

          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-300" />
            <span className="text-sm">Visibility: {weather.visibility} km</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${getPollutionColor(weather.pollution.level).replace('text-', 'bg-')}`} />
            <span className="text-sm">AQI: {weather.pollution.aqi}</span>
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
