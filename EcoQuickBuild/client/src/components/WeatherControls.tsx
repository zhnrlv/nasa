import { useState } from 'react';
import { Calendar as CalendarIcon, Cloud, Sun, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface WeatherControlsProps {
  onFetchWeather: (date: Date, preferences: string[]) => void;
  isLoading?: boolean;
}

export default function WeatherControls({ onFetchWeather, isLoading = false }: WeatherControlsProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [preferences, setPreferences] = useState<string[]>(['all']);

  const weatherOptions = [
    { id: 'rain', label: 'Rain', icon: Cloud },
    { id: 'temperature', label: 'Temperature', icon: Sun },
    { id: 'wind', label: 'Wind', icon: Wind },
    { id: 'all', label: 'All', icon: null },
  ];

  const togglePreference = (id: string) => {
    if (id === 'all') {
      setPreferences(['all']);
    } else {
      const newPrefs = preferences.includes(id)
        ? preferences.filter(p => p !== id && p !== 'all')
        : [...preferences.filter(p => p !== 'all'), id];
      setPreferences(newPrefs.length === 0 ? ['all'] : newPrefs);
    }
  };

  const handleFetch = () => {
    onFetchWeather(date, preferences);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              data-testid="button-date-picker"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
              fromDate={new Date(2020, 0, 1)}
              toDate={new Date(2030, 11, 31)}
              disabled={(date) => date < new Date('1900-01-01')}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Weather Concerns</label>
        <div className="grid grid-cols-2 gap-2">
          {weatherOptions.map(option => {
            const Icon = option.icon;
            const isSelected = preferences.includes(option.id) || 
              (preferences.includes('all') && option.id === 'all');
            
            return (
              <Button
                key={option.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePreference(option.id)}
                className="justify-start"
                data-testid={`button-preference-${option.id}`}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Button 
        className="w-full" 
        size="lg"
        onClick={handleFetch}
        disabled={isLoading}
        data-testid="button-fetch-weather"
      >
        {isLoading ? 'Loading...' : 'Get Weather Likelihood'}
      </Button>
    </Card>
  );
}
