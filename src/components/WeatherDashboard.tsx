import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Wind, Droplets, Eye, Gauge } from "lucide-react";
import { toast } from "sonner";
import { WeatherIcon } from "./WeatherIcon";
import { ForecastCard } from "./ForecastCard";

const API_KEY = "204f70a13f40358cc852df7087fc032a";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherData {
  name: string;
  sys: { country: string };
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
  wind: { speed: number };
  visibility: number;
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

export const WeatherDashboard = () => {
  const [city, setCity] = useState("London");
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      const weatherRes = await fetch(
        `${API_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      
      if (!weatherRes.ok) {
        throw new Error("City not found");
      }
      
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(
        `${API_BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
      
      setCity(cityName);
      toast.success(`Weather loaded for ${weatherData.name}`);
    } catch (error) {
      toast.error("Failed to fetch weather data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput);
    }
  };

  const getDailyForecasts = () => {
    if (!forecast) return [];
    
    const dailyData: { [key: string]: typeof forecast.list[0] } = {};
    
    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });
    
    return Object.values(dailyData).slice(1, 6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Weather Dashboard
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search city..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm border-0 shadow-weather"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-white/90 text-primary hover:bg-white shadow-weather"
            >
              Search
            </Button>
          </form>
        </header>

        {loading && (
          <div className="text-center text-white text-xl">Loading weather data...</div>
        )}

        {!loading && weather && (
          <>
            <Card className="backdrop-blur-md bg-white/10 border-0 shadow-weather text-white p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xl mb-2">
                    <MapPin className="h-6 w-6" />
                    <span className="font-semibold">
                      {weather.name}, {weather.sys.country}
                    </span>
                  </div>
                  <div className="text-6xl md:text-8xl font-bold mb-2">
                    {Math.round(weather.main.temp)}°C
                  </div>
                  <div className="text-xl capitalize">
                    {weather.weather[0].description}
                  </div>
                  <div className="text-lg text-white/80 mt-1">
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <WeatherIcon 
                    icon={weather.weather[0].icon} 
                    description={weather.weather[0].description}
                    size="large"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <Wind className="h-8 w-8 text-white/80" />
                  <div>
                    <div className="text-sm text-white/70">Wind Speed</div>
                    <div className="text-xl font-semibold">{weather.wind.speed} m/s</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Droplets className="h-8 w-8 text-white/80" />
                  <div>
                    <div className="text-sm text-white/70">Humidity</div>
                    <div className="text-xl font-semibold">{weather.main.humidity}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Gauge className="h-8 w-8 text-white/80" />
                  <div>
                    <div className="text-sm text-white/70">Pressure</div>
                    <div className="text-xl font-semibold">{weather.main.pressure} hPa</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-white/80" />
                  <div>
                    <div className="text-sm text-white/70">Visibility</div>
                    <div className="text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
                  </div>
                </div>
              </div>
            </Card>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
                5-Day Forecast
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {getDailyForecasts().map((day, index) => (
                  <ForecastCard key={index} data={day} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
