import WeatherChart from '../WeatherChart';

export default function WeatherChartExample() {
  const mockData = [
    { date: 'Jan 1', temperature: 22, rainfall: 3, windSpeed: 5 },
    { date: 'Jan 2', temperature: 24, rainfall: 0, windSpeed: 4 },
    { date: 'Jan 3', temperature: 23, rainfall: 8, windSpeed: 7 },
    { date: 'Jan 4', temperature: 21, rainfall: 12, windSpeed: 9 },
    { date: 'Jan 5', temperature: 20, rainfall: 5, windSpeed: 6 },
    { date: 'Jan 6', temperature: 22, rainfall: 2, windSpeed: 4 },
    { date: 'Jan 7', temperature: 25, rainfall: 0, windSpeed: 3 },
  ];

  return <WeatherChart data={mockData} />;
}
