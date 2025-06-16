import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from 'lucide-react';
import { getWeatherByCoords, WeatherData as WeatherDataType } from '@/services/weatherService';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  city: string;
  air_quality: {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    'us-epa-index': number;
    'gb-defra-index': number;
  };
}

const WeatherSection = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    condition: 'Loading...',
    humidity: 0,
    windSpeed: 0,
    visibility: 0,
    city: 'Loading...',
    air_quality: {
      co: 0,
      no2: 0,
      o3: 0,
      so2: 0,
      pm2_5: 0,
      pm10: 0,
      'us-epa-index': 0,
      'gb-defra-index': 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await getWeatherByCoords(lat, lon);
      console.log('Weather API response:', weatherData);

      // Defensive check
      if (
        !weatherData ||
        !weatherData.main ||
        !weatherData.weather ||
        !weatherData.wind ||
        !weatherData.air_quality
      ) {
        setError('Weather data is unavailable or incomplete.');
        setLoading(false);
        return;
      }

      setWeather({
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        visibility: weatherData.visibility,
        city: weatherData.name,
        air_quality: weatherData.air_quality,
      });
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const getAQILevel = (epaIndex: number) => {
    switch (epaIndex) {
      case 1:
        return { label: 'Good', color: 'text-green-400' };
      case 2:
        return { label: 'Moderate', color: 'text-yellow-400' };
      case 3:
        return { label: 'Unhealthy for Sensitive', color: 'text-orange-400' };
      case 4:
        return { label: 'Unhealthy', color: 'text-red-400' };
      case 5:
        return { label: 'Very Unhealthy', color: 'text-purple-400' };
      case 6:
        return { label: 'Hazardous', color: 'text-pink-600' };
      default:
        return { label: 'Unknown', color: 'text-gray-400' };
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

  const aqi = weather.air_quality['us-epa-index'];
  const aqiLevel = getAQILevel(aqi);

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
            <span className="text-sm">Wind: {Math.round(weather.windSpeed)} km/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-300" />
            <span className="text-sm">Visibility: {weather.visibility} km</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${aqiLevel.color.replace('text-', 'bg-')}`} />
            <span className="text-sm">AQI: {aqi} ({aqiLevel.label})</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <div className="text-sm font-medium">Air Quality Details</div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div>PM2.5: <span className="font-bold">{weather.air_quality.pm2_5.toFixed(1)}</span></div>
            <div>PM10: <span className="font-bold">{weather.air_quality.pm10.toFixed(1)}</span></div>
            <div>CO: <span className="font-bold">{weather.air_quality.co.toFixed(1)}</span></div>
            <div>NO₂: <span className="font-bold">{weather.air_quality.no2.toFixed(1)}</span></div>
            <div>O₃: <span className="font-bold">{weather.air_quality.o3.toFixed(1)}</span></div>
            <div>SO₂: <span className="font-bold">{weather.air_quality.so2.toFixed(1)}</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherSection;
