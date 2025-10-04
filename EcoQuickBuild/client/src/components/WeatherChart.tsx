import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeatherDataPoint {
  date: string;
  temperature: number;
  rainfall: number;
  windSpeed: number;
}

interface WeatherChartProps {
  data: WeatherDataPoint[];
}

export default function WeatherChart({ data }: WeatherChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 border shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
              {entry.name === 'Temperature' ? '°C' : 
               entry.name === 'Rainfall' ? 'mm' : 'm/s'}
            </p>
          ))}
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="p-6" data-testid="card-weather-chart">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Weather Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: '°C', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'mm', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="temperature" 
                name="Temperature"
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))', r: 3 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="rainfall" 
                name="Rainfall"
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))', r: 3 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="windSpeed" 
                name="Wind Speed"
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
              />
            </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
