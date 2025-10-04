import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection onGetStarted={() => setShowDashboard(true)} />
      <Footer />
    </div>
  );
}
