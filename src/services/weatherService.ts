import axios from 'axios';

const WEATHER_BASE_URL = '/.netlify/functions/weather-proxy';

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  name: string;
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

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(WEATHER_BASE_URL, {
      params: {
        q: city,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(WEATHER_BASE_URL, {
      params: {
        lat,
        lon,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
