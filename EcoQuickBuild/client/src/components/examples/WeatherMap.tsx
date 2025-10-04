import WeatherMap from '../WeatherMap';

export default function WeatherMapExample() {
  return (
    <div className="h-[500px] w-full">
      <WeatherMap 
        onLocationSelect={(lat, lon, name) => {
          console.log('Location selected:', { lat, lon, name });
        }} 
      />
    </div>
  );
}
