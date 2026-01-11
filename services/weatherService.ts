
import { WeatherData } from '../types';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function fetchCoordinates(city: string) {
  const params = new URLSearchParams({
    name: city,
    count: '1',
    language: 'pt',
    format: 'json'
  });

  const response = await fetch(`${GEO_BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Falha ao buscar cidade.');
  
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('Cidade não encontrada.');
  }
  
  return data.results[0];
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current_weather: 'true',
    hourly: 'temperature_2m,weathercode',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
    timezone: 'auto'
  });

  const response = await fetch(`${WEATHER_BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Falha ao obter dados meteorológicos.');
  }
  return response.json();
}
