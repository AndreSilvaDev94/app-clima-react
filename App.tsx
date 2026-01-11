
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, RefreshCcw, AlertTriangle, Thermometer, Droplets, Wind as WindIcon, X, Navigation, Globe } from 'lucide-react';
import { fetchWeather, fetchCoordinates } from './services/weatherService';
import { WeatherData } from './types';
import { WEATHER_INTERPRETATION, DEFAULT_WEATHER } from './constants';
import WeatherCard from './components/WeatherCard';

interface LocationDetails {
  lat: number;
  lon: number;
  name: string;
  state?: string;
  country?: string;
}

const App: React.FC = () => {
  const [cityName, setCityName] = useState('São Paulo');
  const [searchInput, setSearchInput] = useState('');
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWeatherData = useCallback(async (details: LocationDetails) => {
    try {
      setIsRefreshing(true);
      const data = await fetchWeather(details.lat, details.lon);
      setWeather(data);
      setLocation(details);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar clima.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim() || cityName;
    if (!query) return;

    setIsLoading(true);
    setError(null);
    try {
      const coords = await fetchCoordinates(query);
      const details: LocationDetails = {
        lat: coords.latitude,
        lon: coords.longitude,
        name: coords.name,
        state: coords.admin1,
        country: coords.country
      };
      await loadWeatherData(details);
      setCityName(coords.name);
      setSearchInput('');
    } catch (err: any) {
      setError(err.message || "Cidade não encontrada.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStatus = weather ? (WEATHER_INTERPRETATION[weather.current_weather.weathercode] || DEFAULT_WEATHER) : DEFAULT_WEATHER;

  const formatHour = (timeStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(timeStr));
  };

  const formatDay = (timeStr: string) => {
    const date = new Date(timeStr);
    const today = new Date().toDateString();
    if (date.toDateString() === today) return "Hoje";
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
  };

  const now = new Date();
  const currentHourIdx = weather?.hourly.time.findIndex(t => {
    const d = new Date(t);
    return d.getHours() === now.getHours() && d.getDate() === now.getDate();
  }) ?? 0;
  
  const next24h = weather?.hourly.time.slice(currentHourIdx, currentHourIdx + 24).map((time, i) => ({
    time,
    temp: weather.hourly.temperature_2m[currentHourIdx + i],
    code: weather.hourly.weathercode[currentHourIdx + i]
  })) || [];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStatus.bgGradient} transition-all duration-1000 p-4 md:p-8 flex flex-col items-center`}>
      <div className="max-w-4xl w-full">
        
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 mt-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight truncate">
                {location?.name}{location?.state ? `, ${location.state}` : ''}
              </h1>
              <p className="text-xs text-white/70 uppercase tracking-widest flex items-center gap-1">
                <Globe className="w-3 h-3" /> {location?.country || 'Local'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar cidade..."
              className="w-full glass pl-10 pr-10 py-3 rounded-2xl outline-none focus:ring-2 ring-white/20 transition-all text-white placeholder:text-white/40"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
            {searchInput && (
              <button 
                type="button" 
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </form>

          <button 
            onClick={() => location && loadWeatherData(location)}
            disabled={isRefreshing || isLoading}
            className={`p-3 rounded-full glass transition-transform active:scale-95 hidden md:block ${isRefreshing ? 'animate-spin' : ''}`}
            title="Atualizar"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </header>

        {error && (
          <div className="glass bg-red-500/10 border-red-500/20 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {isLoading && !weather ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : weather ? (
          <main className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-700">
            
            {/* Hero Section */}
            <section className="md:col-span-12 flex flex-col items-center text-center py-6 mb-2">
              <div className="w-40 h-40 mb-6 drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]">
                {currentStatus.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-8xl md:text-9xl font-bold tracking-tighter drop-shadow-md">
                  {Math.round(weather.current_weather.temperature)}°
                </span>
                <span className="text-xl md:text-2xl font-medium text-white/90 mt-2">
                  {currentStatus.label}
                </span>
              </div>
              
              <div className="flex gap-6 mt-8">
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Máx: {Math.round(weather.daily.temperature_2m_max[0])}°</span>
                </div>
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl">
                  <Thermometer className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Mín: {Math.round(weather.daily.temperature_2m_min[0])}°</span>
                </div>
              </div>
            </section>

            {/* Hourly Forecast */}
            <WeatherCard title="Previsão Próximas 24 Horas" className="md:col-span-12">
              <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
                {next24h.map((h, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[70px] snap-center">
                    <span className="text-xs text-white/60 mb-3">{formatHour(h.time)}</span>
                    <div className="w-10 h-10 mb-3">
                      {WEATHER_INTERPRETATION[h.code]?.icon || DEFAULT_WEATHER.icon}
                    </div>
                    <span className="text-lg font-bold">{Math.round(h.temp)}°</span>
                  </div>
                ))}
              </div>
            </WeatherCard>

            {/* Daily Forecast List */}
            <WeatherCard title="Próximos 5 Dias" className="md:col-span-7">
              <div className="space-y-6">
                {weather.daily.time.slice(0, 5).map((day, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="w-32 text-sm font-medium capitalize text-white/80 group-hover:text-white transition-colors">
                      {formatDay(day)}
                    </span>
                    <div className="w-8 h-8">
                      {WEATHER_INTERPRETATION[weather.daily.weathercode[i]]?.icon}
                    </div>
                    <div className="flex items-center gap-4 w-28 justify-end">
                      <span className="text-sm font-bold">{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                      <span className="text-sm text-white/40">{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </WeatherCard>

            {/* Details / Stats */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <WeatherCard className="flex flex-col items-center justify-center py-8">
                <WindIcon className="w-8 h-8 text-blue-300 mb-3" />
                <span className="text-xs text-white/50 mb-1 uppercase">Vento</span>
                <span className="text-xl font-bold">{weather.current_weather.windspeed} <small className="text-sm font-normal">km/h</small></span>
              </WeatherCard>
              <WeatherCard className="flex flex-col items-center justify-center py-8">
                <Navigation className="w-8 h-8 text-indigo-300 mb-3" style={{ transform: `rotate(${weather.current_weather.winddirection}deg)` }} />
                <span className="text-xs text-white/50 mb-1 uppercase">Direção</span>
                <span className="text-xl font-bold">{weather.current_weather.winddirection}°</span>
              </WeatherCard>
              <WeatherCard className="col-span-2 flex items-center gap-6 py-6 px-8">
                <Droplets className="w-10 h-10 text-cyan-400" />
                <div>
                  <span className="block text-xs text-white/50 uppercase">Condição Atual</span>
                  <span className="text-lg font-bold">{currentStatus.label}</span>
                </div>
              </WeatherCard>
            </div>

          </main>
        ) : null}

        <footer className="mt-12 mb-8 text-center text-white/30 text-xs">
          <p>Dados fornecidos por Open-Meteo • Design por ClimaFlow</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
