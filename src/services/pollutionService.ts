import axios from 'axios';

const POLLUTION_API_KEY = import.meta.env.VITE_POLLUTION_API_KEY || process.env.VITE_POLLUTION_API_KEY;
const POLLUTION_BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!POLLUTION_API_KEY) {
  console.error('Pollution API key is not defined. Please check your environment variables.');
}

export interface PollutionData {
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
    dt: number;
  }>;
}

export const getPollutionByCoords = async (lat: number, lon: number): Promise<PollutionData> => {
  try {
    const response = await axios.get(`${POLLUTION_BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: POLLUTION_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pollution data:', error);
    throw error;
  }
};

export const getAQIDescription = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'Good';
    case 2:
      return 'Fair';
    case 3:
      return 'Moderate';
    case 4:
      return 'Poor';
    case 5:
      return 'Very Poor';
    default:
      return 'Unknown';
  }
};
