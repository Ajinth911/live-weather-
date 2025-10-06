import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, Wind, CloudFog } from "lucide-react";

interface WeatherIconProps {
  icon: string;
  description: string;
  size?: "small" | "medium" | "large";
}

export const WeatherIcon = ({ icon, description, size = "medium" }: WeatherIconProps) => {
  const sizeMap = {
    small: "h-12 w-12",
    medium: "h-16 w-16",
    large: "h-24 w-24 md:h-32 md:w-32",
  };

  const iconSize = sizeMap[size];
  const iconCode = icon.slice(0, 2);

  const getIcon = () => {
    switch (iconCode) {
      case "01":
        return <Sun className={`${iconSize} text-yellow-300`} />;
      case "02":
      case "03":
      case "04":
        return <Cloud className={`${iconSize} text-white/90`} />;
      case "09":
        return <CloudDrizzle className={`${iconSize} text-blue-200`} />;
      case "10":
        return <CloudRain className={`${iconSize} text-blue-300`} />;
      case "11":
        return <CloudLightning className={`${iconSize} text-yellow-200`} />;
      case "13":
        return <CloudSnow className={`${iconSize} text-blue-100`} />;
      case "50":
        return <CloudFog className={`${iconSize} text-gray-300`} />;
      default:
        return <Cloud className={`${iconSize} text-white/90`} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2" title={description}>
      {getIcon()}
    </div>
  );
};
