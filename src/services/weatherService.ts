// src/services/weatherService.ts
'use server';

import { Sun, Cloud, CloudRain, CloudSnow, Zap, CloudDrizzle, Haze } from 'lucide-react';

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    precipitation_probability: string;
    weather_code: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
}


export const fetchWeatherForecast = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=7`;
  try {
    const response = await fetch(url);
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

export const getWeatherDescription = (weatherCode: number): string => {
  const descriptions: { [key: number]: string } = {
    0: 'Cielo despejado',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    56: 'Llovizna helada ligera',
    57: 'Llovizna helada densa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia fuerte',
    66: 'Lluvia helada ligera',
    67: 'Lluvia helada fuerte',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve fuerte',
    77: 'Granos de nieve',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos violentos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve fuertes',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo fuerte',
  };
  return descriptions[weatherCode] || 'Condición desconocida';
};

export const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode <= 1) return Sun;
    if (weatherCode <= 3) return Cloud;
    if (weatherCode >= 51 && weatherCode <= 67) return CloudRain;
    if (weatherCode >= 80 && weatherCode <= 82) return CloudRain;
    if (weatherCode >= 71 && weatherCode <= 77) return CloudSnow;
    if (weatherCode >= 95 && weatherCode <= 99) return Zap;
    if (weatherCode >= 51 && weatherCode <= 57) return CloudDrizzle;
    if (weatherCode >= 45 && weatherCode <= 48) return Haze;
    return Cloud;
};

export const willItRainSoon = (hourlyData: WeatherData['hourly'], threshold: number = 20): boolean => {
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  for (let i = 0; i < hourlyData.time.length; i++) {
    const forecastTime = new Date(hourlyData.time[i]);
    if (forecastTime > now && forecastTime <= next24h) {
      if (hourlyData.precipitation_probability[i] >= threshold) {
        return true;
      }
    }
  }
  return false;
};
