import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cloud, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-background via-background to-card">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--chart-1)/0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chart-1/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary"
          >
            <Sparkles className="w-4 h-4" />
            NASA Space Apps Challenge 2025
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight">
              Will It Rain On{' '}
              <span className="text-gradient-nasa">My Parade?</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Predict weather conditions for your outdoor events using NASA's Earth observation data. 
              Check rainfall, temperature, and wind forecasts for any location and date.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 group"
              onClick={onGetStarted}
              data-testid="button-get-started"
            >
              <Cloud className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Forecasting
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="pt-8"
          >
            <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
                NASA POWER API
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                GPM Data
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                Real-time Analysis
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
