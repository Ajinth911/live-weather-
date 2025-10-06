import { Card } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";

interface ForecastCardProps {
  data: {
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
  };
}

export const ForecastCard = ({ data }: ForecastCardProps) => {
  const date = new Date(data.dt * 1000);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Card className="backdrop-blur-md bg-white/10 border-0 shadow-weather text-white p-4 text-center hover:bg-white/20 transition-all duration-300">
      <div className="font-semibold text-lg">{dayName}</div>
      <div className="text-sm text-white/70 mb-3">{dateStr}</div>
      
      <div className="flex justify-center mb-3">
        <WeatherIcon 
          icon={data.weather[0].icon} 
          description={data.weather[0].description}
          size="small"
        />
      </div>
      
      <div className="text-2xl font-bold mb-1">
        {Math.round(data.main.temp)}°C
      </div>
      
      <div className="text-sm text-white/70 capitalize">
        {data.weather[0].description}
      </div>
      
      <div className="text-xs text-white/60 mt-2">
        H: {Math.round(data.main.temp_max)}° L: {Math.round(data.main.temp_min)}°
      </div>
    </Card>
  );
};
