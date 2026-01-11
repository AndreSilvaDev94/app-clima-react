
import React from 'react';
import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  CloudSun, 
  Sun,
  Wind
} from 'lucide-react';

export const WEATHER_INTERPRETATION: Record<number, { label: string, icon: React.ReactNode, bgGradient: string }> = {
  0: { label: 'Céu limpo', icon: <Sun className="w-full h-full text-yellow-400" />, bgGradient: 'from-blue-400 to-blue-600' },
  1: { label: 'Predom. limpo', icon: <CloudSun className="w-full h-full text-blue-200" />, bgGradient: 'from-blue-500 to-indigo-600' },
  2: { label: 'Parcialmente nublado', icon: <CloudSun className="w-full h-full text-blue-200" />, bgGradient: 'from-blue-500 to-slate-700' },
  3: { label: 'Nublado', icon: <Cloud className="w-full h-full text-gray-400" />, bgGradient: 'from-slate-600 to-slate-800' },
  45: { label: 'Nevoeiro', icon: <CloudFog className="w-full h-full text-gray-300" />, bgGradient: 'from-slate-700 to-slate-900' },
  48: { label: 'Nevoeiro geada', icon: <CloudFog className="w-full h-full text-gray-300" />, bgGradient: 'from-slate-700 to-slate-900' },
  51: { label: 'Drizzle leve', icon: <CloudDrizzle className="w-full h-full text-blue-300" />, bgGradient: 'from-indigo-600 to-indigo-800' },
  53: { label: 'Drizzle moderada', icon: <CloudDrizzle className="w-full h-full text-blue-300" />, bgGradient: 'from-indigo-600 to-indigo-800' },
  55: { label: 'Drizzle densa', icon: <CloudDrizzle className="w-full h-full text-blue-300" />, bgGradient: 'from-indigo-700 to-indigo-900' },
  61: { label: 'Chuva leve', icon: <CloudRain className="w-full h-full text-blue-400" />, bgGradient: 'from-blue-700 to-blue-900' },
  63: { label: 'Chuva moderada', icon: <CloudRain className="w-full h-full text-blue-400" />, bgGradient: 'from-blue-800 to-blue-950' },
  65: { label: 'Chuva forte', icon: <CloudRain className="w-full h-full text-blue-500" />, bgGradient: 'from-blue-900 to-black' },
  71: { label: 'Neve leve', icon: <CloudSnow className="w-full h-full text-white" />, bgGradient: 'from-slate-400 to-slate-600' },
  73: { label: 'Neve moderada', icon: <CloudSnow className="w-full h-full text-white" />, bgGradient: 'from-slate-500 to-slate-700' },
  75: { label: 'Neve forte', icon: <CloudSnow className="w-full h-full text-white" />, bgGradient: 'from-slate-600 to-slate-800' },
  80: { label: 'Aguaceiros leves', icon: <CloudRain className="w-full h-full text-blue-400" />, bgGradient: 'from-blue-600 to-blue-800' },
  81: { label: 'Aguaceiros mod.', icon: <CloudRain className="w-full h-full text-blue-400" />, bgGradient: 'from-blue-700 to-blue-900' },
  82: { label: 'Aguaceiros fortes', icon: <CloudRain className="w-full h-full text-blue-400" />, bgGradient: 'from-blue-800 to-black' },
  95: { label: 'Trovoada', icon: <CloudLightning className="w-full h-full text-yellow-500" />, bgGradient: 'from-purple-800 to-black' },
  96: { label: 'Trovoada c/ granizo', icon: <CloudLightning className="w-full h-full text-yellow-500" />, bgGradient: 'from-purple-900 to-black' },
  99: { label: 'Trovoada forte', icon: <CloudLightning className="w-full h-full text-yellow-600" />, bgGradient: 'from-purple-950 to-black' },
};

export const DEFAULT_WEATHER = { label: 'Clima', icon: <Wind className="w-full h-full text-gray-400" />, bgGradient: 'from-slate-700 to-slate-900' };
