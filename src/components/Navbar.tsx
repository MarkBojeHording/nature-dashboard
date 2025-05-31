
import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <h1 className="text-2xl font-bold">Nature Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-6 text-white">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="text-lg font-medium">{formatDate(currentTime)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span className="text-xl font-mono">{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
