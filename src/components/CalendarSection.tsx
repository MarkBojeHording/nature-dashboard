
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'event' | 'reminder';
}

const CalendarSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'event' as Event['type']
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('dashboard-events');
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents);
      setEvents(parsed.map((event: any) => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime)
      })));
    } else {
      // Add some sample events
      const sampleEvents: Event[] = [
        {
          id: '1',
          title: 'Team Meeting',
          description: 'Weekly team sync',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
          type: 'meeting'
        },
        {
          id: '2',
          title: 'Project Deadline',
          description: 'Complete dashboard project',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
          type: 'reminder'
        }
      ];
      setEvents(sampleEvents);
    }
  }, []);

  const saveEvents = (updatedEvents: Event[]) => {
    localStorage.setItem('dashboard-events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.startTime || !newEvent.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      startTime: new Date(newEvent.startTime),
      endTime: new Date(newEvent.endTime),
      type: newEvent.type
    };

    if (event.startTime >= event.endTime) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return;
    }

    const updatedEvents = [...events, event].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    saveEvents(updatedEvents);
    
    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      type: 'event'
    });
    setIsAdding(false);
    
    toast({
      title: "Event added",
      description: "Your event has been added successfully."
    });
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    saveEvents(updatedEvents);
    
    toast({
      title: "Event deleted",
      description: "Your event has been deleted."
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (event: Event) => {
    return event.startTime > new Date();
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'reminder':
        return 'bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'bg-green-500/20 border-green-500/30';
    }
  };

  const upcomingEvents = events.filter(isUpcoming).slice(0, 5);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Calendar & Agenda</span>
          </span>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="space-y-3 p-3 bg-black/20 rounded-lg">
            <Input
              placeholder="Event title..."
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-300"
            />
            
            <Textarea
              placeholder="Description (optional)..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-300"
              rows={2}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-300 mb-1 block">Start Time</label>
                <Input
                  type="datetime-local"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 mb-1 block">End Time</label>
                <Input
                  type="datetime-local"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="event">Event</option>
              <option value="meeting">Meeting</option>
              <option value="reminder">Reminder</option>
            </select>
            
            <div className="flex space-x-2">
              <Button onClick={addEvent} size="sm" className="bg-green-600 hover:bg-green-700">
                Add Event
              </Button>
              <Button 
                onClick={() => setIsAdding(false)} 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-medium text-sm flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Upcoming Events</span>
          </h3>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center text-gray-300 py-4">
              <div className="text-sm">No upcoming events</div>
              <div className="text-xs">Click + to add an event</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-gray-300 mt-1">{event.description}</p>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        {formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {event.type}
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteEvent(event.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-500/20 h-6 w-6 p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-300 mt-4 p-2 bg-black/20 rounded">
          <strong>Google Calendar Integration:</strong> For full Google Calendar sync, you would need to connect through Google Calendar API. Currently, events are stored locally.
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSection;
