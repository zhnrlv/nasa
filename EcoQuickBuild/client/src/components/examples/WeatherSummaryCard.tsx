import WeatherSummaryCard from '../WeatherSummaryCard';

export default function WeatherSummaryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <WeatherSummaryCard
        type="rain"
        percentage={65}
        label="Chance of rain"
        emoji="💧"
        index={0}
      />
      <WeatherSummaryCard
        type="hot"
        percentage={20}
        label="Chance of heatwave"
        emoji="🔥"
        index={1}
      />
      <WeatherSummaryCard
        type="wind"
        percentage={40}
        label="Chance of high wind"
        emoji="🌬️"
        index={2}
      />
      <WeatherSummaryCard
        type="cold"
        percentage={5}
        label="Chance of cold"
        emoji="❄️"
        index={3}
      />
    </div>
  );
}
