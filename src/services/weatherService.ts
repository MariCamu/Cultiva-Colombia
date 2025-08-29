// src/services/weatherService.ts
'use server';
import type { WeatherData } from '@/lib/weather-utils';


export async function fetchWeatherForecast(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=7`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();
    return data as WeatherData;
  } catch (error) {
    console.error("Failed to fetch weather forecast:", error);
    throw error;
  }
};
