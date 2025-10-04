import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // NASA POWER API endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon, date } = req.query;

      if (!lat || !lon || !date) {
        return res.status(400).json({ error: "Missing required parameters: lat, lon, date" });
      }

      const targetDate = new Date(date as string);
      const now = new Date();
      
      // Calculate date range for historical data (7 days before target date)
      const endDate = new Date(Math.min(targetDate.getTime(), now.getTime()));
      const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);
      
      const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      // Fetch data from NASA POWER API
      const params = new URLSearchParams({
        parameters: 'T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,WS10M,RH2M',
        community: 'AG',
        longitude: lon as string,
        latitude: lat as string,
        start: formatDate(startDate),
        end: formatDate(endDate),
        format: 'JSON'
      });

      const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?${params}`;
      const response = await fetch(nasaUrl);
      
      if (!response.ok) {
        throw new Error(`NASA API returned ${response.status}`);
      }

      const data = await response.json();
      
      // Process the data
      const parameters = data.properties.parameter;
      const dates = Object.keys(parameters.T2M || {});
      
      // Calculate weather statistics
      const temps = dates.map(d => parameters.T2M?.[d] || 0);
      const precips = dates.map(d => parameters.PRECTOTCORR?.[d] || 0);
      const winds = dates.map(d => parameters.WS10M?.[d] || 0);
      const humidity = dates.map(d => parameters.RH2M?.[d] || 0);
      
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const avgPrecip = precips.reduce((a, b) => a + b, 0) / precips.length;
      const avgWind = winds.reduce((a, b) => a + b, 0) / winds.length;
      const avgHumidity = humidity.reduce((a, b) => a + b, 0) / humidity.length;
      
      // Calculate likelihood percentages for future dates
      const rainChance = targetDate > now 
        ? Math.min(100, Math.max(0, avgPrecip > 0 ? (avgPrecip / 10) * 100 : 10))
        : 0;
      
      const hotChance = targetDate > now
        ? Math.min(100, Math.max(0, avgTemp > 30 ? ((avgTemp - 30) / 15) * 100 : 0))
        : 0;
      
      const coldChance = targetDate > now
        ? Math.min(100, Math.max(0, avgTemp < 10 ? ((10 - avgTemp) / 15) * 100 : 0))
        : 0;
      
      const windChance = targetDate > now
        ? Math.min(100, Math.max(0, avgWind > 5 ? ((avgWind - 5) / 10) * 100 : 0))
        : 0;

      // Event recommendations based on weather conditions
      interface EventRecommendation {
        name: string;
        suitable: boolean;
        reason: string;
        icon: string;
      }

      const recommendations: EventRecommendation[] = [];
      
      if (targetDate > now) {
        // Outdoor Concert/Festival
        const outdoorScore = 100 - (rainChance * 0.7 + windChance * 0.3);
        recommendations.push({
          name: 'Outdoor Concert/Festival',
          suitable: outdoorScore > 60,
          reason: rainChance > 40 ? 'High chance of rain' : windChance > 50 ? 'Strong winds expected' : 'Good weather conditions',
          icon: '🎵'
        });

        // Hiking/Trekking
        const hikingScore = 100 - (rainChance * 0.5 + windChance * 0.3 + (avgTemp > 35 ? 50 : 0) + (avgTemp < 5 ? 50 : 0));
        recommendations.push({
          name: 'Hiking/Trekking',
          suitable: hikingScore > 50,
          reason: rainChance > 40 ? 'Rain makes trails slippery' : avgTemp > 35 ? 'Too hot for hiking' : avgTemp < 5 ? 'Too cold for outdoor activity' : 'Perfect hiking conditions',
          icon: '🥾'
        });

        // Sports Event (outdoor)
        const sportsScore = 100 - (rainChance * 0.8 + windChance * 0.2);
        recommendations.push({
          name: 'Outdoor Sports',
          suitable: sportsScore > 65,
          reason: rainChance > 35 ? 'Rain will affect gameplay' : windChance > 60 ? 'High winds may interfere' : 'Good conditions for sports',
          icon: '⚽'
        });

        // Beach Day
        const beachScore = 100 - (rainChance * 0.6 + windChance * 0.2 + (avgTemp < 20 ? 40 : 0));
        recommendations.push({
          name: 'Beach Day',
          suitable: beachScore > 60,
          reason: rainChance > 30 ? 'Rainy weather expected' : avgTemp < 20 ? 'Too cold for beach' : windChance > 50 ? 'Windy conditions' : 'Perfect beach weather',
          icon: '🏖️'
        });

        // Picnic
        const picnicScore = 100 - (rainChance * 0.9 + windChance * 0.4);
        recommendations.push({
          name: 'Picnic',
          suitable: picnicScore > 55,
          reason: rainChance > 25 ? 'Rain likely to interrupt' : windChance > 55 ? 'Too windy' : 'Ideal for outdoor dining',
          icon: '🧺'
        });

        // Wedding (outdoor)
        const weddingScore = 100 - (rainChance * 0.95 + windChance * 0.3);
        recommendations.push({
          name: 'Outdoor Wedding',
          suitable: weddingScore > 70,
          reason: rainChance > 20 ? 'Rain risk too high' : windChance > 50 ? 'Wind may cause issues' : 'Beautiful weather for ceremony',
          icon: '💒'
        });

        // Camping
        const campingScore = 100 - (rainChance * 0.7 + windChance * 0.5 + (avgTemp < 0 ? 60 : 0));
        recommendations.push({
          name: 'Camping',
          suitable: campingScore > 50,
          reason: rainChance > 40 ? 'Rain makes camping difficult' : windChance > 60 ? 'Strong winds unsafe for tents' : avgTemp < 0 ? 'Freezing temperatures' : 'Great camping weather',
          icon: '⛺'
        });

        // Cycling
        const cyclingScore = 100 - (rainChance * 0.6 + windChance * 0.4);
        recommendations.push({
          name: 'Cycling',
          suitable: cyclingScore > 60,
          reason: rainChance > 35 ? 'Wet roads dangerous' : windChance > 55 ? 'Strong headwinds' : 'Good cycling conditions',
          icon: '🚴'
        });
      }

      // Build chart data
      const chartData = dates.map((dateStr, i) => {
        const d = new Date(
          parseInt(dateStr.substring(0, 4)),
          parseInt(dateStr.substring(4, 6)) - 1,
          parseInt(dateStr.substring(6, 8))
        );
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          temperature: parameters.T2M?.[dateStr] || 0,
          rainfall: parameters.PRECTOTCORR?.[dateStr] || 0,
          windSpeed: parameters.WS10M?.[dateStr] || 0
        };
      });

      res.json({
        rain: Math.round(rainChance),
        hot: Math.round(hotChance),
        cold: Math.round(coldChance),
        wind: Math.round(windChance),
        temperature: Math.round(avgTemp),
        chartData,
        isFuture: targetDate > now,
        recommendations
      });

    } catch (error) {
      console.error('Error fetching NASA data:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
