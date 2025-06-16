import { Handler } from '@netlify/functions'

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const WEATHER_BASE_URL = 'https://api.weatherapi.com/v1'

export const handler: Handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    }
  }

  if (!WEATHER_API_KEY) {
    console.error('Weather API key is not defined in environment variables')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Weather API key is not configured' })
    }
  }

  try {
    const { lat, lon } = event.queryStringParameters || {}

    if (!lat || !lon) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: lat and lon' })
      }
    }

    const url = `${WEATHER_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=yes`
    console.log('Fetching weather data from:', url)

    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Weather API error:', errorData)
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Weather API request failed', details: errorData })
      }
    }

    const data = await response.json()

    // Transform the data to match our frontend interface
    const transformedData = {
      main: {
        temp: data.current.temp_c,
        feels_like: data.current.feelslike_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb
      },
      weather: [{
        main: data.current.condition.text,
        description: data.current.condition.text,
        icon: data.current.condition.icon
      }],
      wind: {
        speed: data.current.wind_kph,
        deg: data.current.wind_degree
      },
      visibility: data.current.vis_km,
      name: data.location.name,
      air_quality: data.current.air_quality
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Enable CORS
      },
      body: JSON.stringify(transformedData)
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data', details: error.message })
    }
  }
}
