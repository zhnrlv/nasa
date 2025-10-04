import WeatherControls from '../WeatherControls';

export default function WeatherControlsExample() {
  return (
    <div className="max-w-md">
      <WeatherControls 
        onFetchWeather={(date, prefs) => {
          console.log('Fetch weather:', { date, preferences: prefs });
        }}
      />
    </div>
  );
}
