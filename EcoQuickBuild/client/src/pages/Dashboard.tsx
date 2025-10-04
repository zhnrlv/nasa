import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WeatherMap from '@/components/WeatherMap';
import WeatherControls from '@/components/WeatherControls';
import WeatherSummaryCard from '@/components/WeatherSummaryCard';
import WeatherChart from '@/components/WeatherChart';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  lat: number;
  lon: number;
  name: string;
}

interface EventRecommendation {
  name: string;
  suitable: boolean;
  reason: string;
  icon: string;
}

interface WeatherResult {
  rain: number;
  hot: number;
  cold: number;
  wind: number;
  temperature: number;
  chartData: Array<{
    date: string;
    temperature: number;
    rainfall: number;
    windSpeed: number;
  }>;
  isFuture: boolean;
  recommendations: EventRecommendation[];
}

export default function Dashboard() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weatherResult, setWeatherResult] = useState<WeatherResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setLocation({ lat, lon, name });
    toast({
      title: 'Location Selected',
      description: name,
    });
  };

  const handleFetchWeather = async (date: Date, preferences: string[]) => {
    if (!location) {
      toast({
        title: 'No Location Selected',
        description: 'Please click on the map to select a location first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSelectedDate(date);
    
    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lon: location.lon.toString(),
        date: date.toISOString()
      });

      const response = await fetch(`/api/weather?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherResult(data);
      
      toast({
        title: 'Weather Data Retrieved',
        description: 'Real NASA data analysis complete for ' + location.name,
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve weather data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = '/'}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  Weather Dashboard
                </h1>
                {location && (
                  <p className="text-sm text-muted-foreground" data-testid="text-location">
                    {location.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 h-[500px]">
            <WeatherMap 
              onLocationSelect={handleLocationSelect}
              selectedLocation={location ? { lat: location.lat, lon: location.lon } : undefined}
            />
          </div>
          
          <div className="lg:col-span-1">
            <WeatherControls 
              onFetchWeather={handleFetchWeather}
              isLoading={isLoading}
            />
          </div>
        </div>

        {weatherResult && selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {selectedDate > new Date() ? (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                  Weather Likelihood Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <WeatherSummaryCard
                    type="rain"
                    percentage={weatherResult.rain}
                    label="Chance of rain"
                    emoji="💧"
                    index={0}
                  />
                  <WeatherSummaryCard
                    type="hot"
                    percentage={weatherResult.hot}
                    label="Chance of heatwave"
                    emoji="🔥"
                    index={1}
                  />
                  <WeatherSummaryCard
                    type="wind"
                    percentage={weatherResult.wind}
                    label="Chance of high wind"
                    emoji="🌬️"
                    index={2}
                  />
                  <WeatherSummaryCard
                    type="cold"
                    percentage={weatherResult.cold}
                    label="Chance of cold"
                    emoji="❄️"
                    index={3}
                  />
                  <Card className="p-6 relative overflow-hidden hover-elevate" data-testid="card-weather-temperature">
                    <div className="relative space-y-2">
                      <div className="text-4xl">🌡️</div>
                      <div className="text-4xl font-bold text-foreground" data-testid="temperature-value">
                        {weatherResult.temperature}°C
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expected temperature
                      </div>
                    </div>
                  </Card>
                </div>

                {weatherResult.recommendations && weatherResult.recommendations.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                      Event Recommendations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {weatherResult.recommendations.map((rec, index) => (
                        <motion.div
                          key={rec.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card 
                            className={`p-6 relative overflow-hidden hover-elevate ${
                              rec.suitable ? 'border-green-500/50' : 'border-red-500/50'
                            }`}
                            data-testid={`card-event-${rec.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-3xl">{rec.icon}</span>
                                <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  rec.suitable 
                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                                }`}>
                                  {rec.suitable ? 'Suitable' : 'Not Suitable'}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground mb-1">
                                  {rec.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {rec.reason}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                  Historical Weather Data
                </h2>
                <WeatherChart data={weatherResult.chartData} />
              </div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
