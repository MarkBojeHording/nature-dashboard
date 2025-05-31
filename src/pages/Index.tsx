
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WeatherSection from '../components/WeatherSection';
import NotesSection from '../components/NotesSection';
import CalendarSection from '../components/CalendarSection';

const natureBackgrounds = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop'
];

const Index = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % natureBackgrounds.length);
    }, 30000); // Change background every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Images */}
      {natureBackgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ${
            index === currentBg ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${bg})`,
          }}
        />
      ))}
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <Navbar />
        
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          <div className="lg:col-span-1 space-y-6">
            <WeatherSection />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <NotesSection />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <CalendarSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
