
interface WeatherApiResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  name: string;
}

interface AirPollutionApiResponse {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

export interface WeatherData {
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

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = localStorage.getItem('openweather_api_key') || '';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('openweather_api_key', apiKey);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return this.apiKey.length > 0;
  }

  private getAirQualityLevel(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  async getCurrentLocationWeather(): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    // Get user's current location
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    // Fetch weather data
    const weatherResponse = await fetch(
      `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData: WeatherApiResponse = await weatherResponse.json();

    // Fetch air pollution data
    const pollutionResponse = await fetch(
      `${this.baseUrl}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`
    );

    if (!pollutionResponse.ok) {
      throw new Error('Failed to fetch air pollution data');
    }

    const pollutionData: AirPollutionApiResponse = await pollutionResponse.json();

    return {
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed * 3.6, // Convert m/s to km/h
      visibility: weatherData.visibility / 1000, // Convert meters to kilometers
      pollution: {
        aqi: pollutionData.list[0].main.aqi * 50, // Convert to US AQI scale (approximate)
        level: this.getAirQualityLevel(pollutionData.list[0].main.aqi * 50)
      }
    };
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    // Fetch weather data by city name
    const weatherResponse = await fetch(
      `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData: WeatherApiResponse = await weatherResponse.json();

    // Get coordinates for air pollution data
    const { coord } = await weatherResponse.json();
    
    // Fetch air pollution data using coordinates
    const pollutionResponse = await fetch(
      `${this.baseUrl}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${this.apiKey}`
    );

    const pollutionData: AirPollutionApiResponse = pollutionResponse.ok 
      ? await pollutionResponse.json()
      : { list: [{ main: { aqi: 1 } }] }; // Fallback if pollution data fails

    return {
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed * 3.6,
      visibility: weatherData.visibility / 1000,
      pollution: {
        aqi: pollutionData.list[0].main.aqi * 50,
        level: this.getAirQualityLevel(pollutionData.list[0].main.aqi * 50)
      }
    };
  }
}

export const weatherService = new WeatherService();
