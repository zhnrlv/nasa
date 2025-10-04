import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface WeatherSummaryCardProps {
  type: 'rain' | 'hot' | 'cold' | 'wind';
  percentage: number;
  label: string;
  emoji: string;
  index?: number;
}

export default function WeatherSummaryCard({ 
  type, 
  percentage, 
  label, 
  emoji,
  index = 0 
}: WeatherSummaryCardProps) {
  const getColorClass = () => {
    if (percentage >= 70) return 'from-chart-4/20 to-chart-4/5';
    if (percentage >= 40) return 'from-chart-3/20 to-chart-3/5';
    return 'from-chart-2/20 to-chart-2/5';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card 
        className={`p-6 relative overflow-hidden hover-elevate`}
        data-testid={`card-weather-${type}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getColorClass()} opacity-50`} />
        
        <div className="relative space-y-2">
          <div className="text-4xl" data-testid={`emoji-${type}`}>{emoji}</div>
          <div className="text-4xl font-bold text-foreground" data-testid={`percentage-${type}`}>
            {percentage}%
          </div>
          <div className="text-sm text-muted-foreground" data-testid={`label-${type}`}>
            {label}
          </div>
          
          <div className="w-full bg-secondary/30 rounded-full h-2 mt-3">
            <motion.div 
              className={`h-full rounded-full bg-gradient-to-r ${
                percentage >= 70 ? 'from-chart-4 to-chart-4' :
                percentage >= 40 ? 'from-chart-3 to-chart-3' :
                'from-chart-2 to-chart-2'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
