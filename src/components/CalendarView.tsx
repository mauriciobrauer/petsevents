import { useState } from "react";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  personality: string;
  avatar: string;
  ownerId: string;
  ownerName: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  isPrivate: boolean;
  attendees: number;
  description: string;
  organizer: string;
  image?: string;
  attendingPets?: Pet[];
  time: string;
  eventType: string;
}

interface CalendarViewProps {
  onBack: () => void;
  onCreateEvent: () => void;
  onViewEvent: (event: Event) => void;
  onViewPetProfile: (pet: Pet) => void;
}

// Mock data for calendar events
const mockCalendarEvents: Event[] = [
  {
    id: "cal1",
    title: "Paseo Grupal Matutino",
    date: "2024-10-15",
    time: "09:00",
    location: "Parque Central",
    isPrivate: false,
    attendees: 8,
    description: "Paseo relajante por el parque para socializar",
    organizer: "María García",
    eventType: "paseo",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    attendingPets: [
      {
        id: "pet1",
        name: "Max",
        type: "Perro",
        breed: "Golden Retriever",
        age: 3,
        personality: "Amigable y enérgico",
        avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80",
        ownerId: "user1",
        ownerName: "Ana López"
      },
      {
        id: "pet2",
        name: "Luna",
        type: "Gato",
        breed: "Siamés",
        age: 2,
        personality: "Curiosa y cariñosa",
        avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80",
        ownerId: "user2",
        ownerName: "Carlos Ruiz"
      }
    ]
  },
  {
    id: "cal2",
    title: "Clase de Entrenamiento",
    date: "2024-10-18",
    time: "16:00",
    location: "Centro Canino Elite",
    isPrivate: false,
    attendees: 12,
    description: "Entrenamiento básico y avanzado para perros",
    organizer: "Pedro Martín",
    eventType: "entrenamiento",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    attendingPets: [
      {
        id: "pet3",
        name: "Rocky",
        type: "Perro",
        breed: "Pastor Alemán",
        age: 4,
        personality: "Inteligente y obediente",
        avatar: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=150&q=80",
        ownerId: "user3",
        ownerName: "Laura Santos"
      }
    ]
  },
  {
    id: "cal3",
    title: "Día de Adopción",
    date: "2024-10-22",
    time: "10:00",
    location: "Plaza Mayor",
    isPrivate: false,
    attendees: 25,
    description: "Evento especial para encontrar hogares",
    organizer: "Refugio Esperanza",
    eventType: "adopcion",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    attendingPets: []
  },
  {
    id: "cal4",
    title: "Fiesta de Cumpleaños",
    date: "2024-10-25",
    time: "15:30",
    location: "Casa de Emma",
    isPrivate: true,
    attendees: 6,
    description: "Celebración del 5to cumpleaños de Bella",
    organizer: "Emma Díaz",
    eventType: "fiesta",
    attendingPets: [
      {
        id: "pet4",
        name: "Bella",
        type: "Perro",
        breed: "Labrador",
        age: 5,
        personality: "Juguetona y social",
        avatar: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=150&q=80",
        ownerId: "user4",
        ownerName: "Emma Díaz"
      }
    ]
  }
];

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function CalendarView({ onBack, onCreateEvent, onViewEvent, onViewPetProfile }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  const calendarDays = [];
  const currentDatePointer = new Date(startDate);

  while (currentDatePointer <= endDate) {
    calendarDays.push(new Date(currentDatePointer));
    currentDatePointer.setDate(currentDatePointer.getDate() + 1);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockCalendarEvents.filter(event => event.date === dateStr);
  };

  const handleDayClick = (date: Date) => {
    const events = getEventsForDate(date);
    if (events.length > 0) {
      const dateStr = date.toISOString().split('T')[0];
      setSelectedDay(dateStr);
      setShowDayDetails(true);
    }
  };

  const selectedDayEvents = selectedDay ? mockCalendarEvents.filter(event => event.date === selectedDay) : [];

  const getEventTypeEmoji = (type: string) => {
    switch (type) {
      case 'paseo': return '🚶‍♂️';
      case 'entrenamiento': return '🎯';
      case 'adopcion': return '🏠';
      case 'fiesta': return '🎉';
      default: return '🐾';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'paseo': return 'bg-green-100 text-green-700 border-green-200';
      case 'entrenamiento': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'adopcion': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'fiesta': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 p-2 hover:bg-white/50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-gray-800">Calendario de Eventos</h1>
              <p className="text-gray-600">Planifica las actividades de tu mascota</p>
            </div>
          </div>
        </div>

        {/* Calendar Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigateMonth('prev')}
              className="bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-gray-800">
              {monthNames[month]} {year}
            </h2>
            
            <Button
              variant="outline"
              onClick={() => navigateMonth('next')}
              className="bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {dayNames.map((dayName) => (
              <div key={dayName} className="text-center py-2">
                <span className="text-sm text-gray-500">{dayName}</span>
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((date, index) => {
              const events = getEventsForDate(date);
              const isCurrentMonth = date.getMonth() === month;
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(date)}
                  className={`
                    relative p-2 min-h-[80px] rounded-xl border transition-all duration-200
                    ${isCurrentMonth ? 'bg-white/70 border-gray-200' : 'bg-gray-50/50 border-gray-100'}
                    ${events.length > 0 ? 'cursor-pointer hover:bg-white hover:shadow-md hover:scale-[1.02]' : ''}
                    ${isToday ? 'ring-2 ring-blue-400 bg-blue-50/70' : ''}
                  `}
                >
                  <div className={`text-sm ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'} ${isToday ? 'font-bold text-blue-600' : ''}`}>
                    {date.getDate()}
                  </div>

                  {/* Event indicators */}
                  {events.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {events.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`text-xs px-2 py-1 rounded-md border ${getEventTypeColor(event.eventType)} truncate`}
                        >
                          <div className="flex items-center space-x-1">
                            <span>{getEventTypeEmoji(event.eventType)}</span>
                            <span className="truncate">{event.title}</span>
                          </div>
                        </div>
                      ))}
                      
                      {events.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{events.length - 2} más
                        </div>
                      )}

                      {/* Pet avatars */}
                      {events.some(e => e.attendingPets && e.attendingPets.length > 0) && (
                        <div className="flex -space-x-1 justify-center mt-1">
                          {events
                            .flatMap(e => e.attendingPets || [])
                            .slice(0, 3)
                            .map((pet, petIndex) => (
                              <Avatar
                                key={petIndex}
                                className="w-5 h-5 border border-white ring-1 ring-gray-200"
                              >
                                <AvatarImage src={pet.avatar} alt={pet.name} />
                                <AvatarFallback className="text-xs bg-purple-200 text-purple-700">
                                  {pet.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Create Event Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
            <Button
              onClick={onCreateEvent}
              className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Day Details Dialog */}
        <Dialog open={showDayDetails} onOpenChange={setShowDayDetails}>
          <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-white/20 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-800">
                Eventos del {selectedDay ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : ''}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedDayEvents.map((event) => (
                <Card
                  key={event.id}
                  onClick={() => {
                    setShowDayDetails(false);
                    onViewEvent(event);
                  }}
                  className="bg-white/70 border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    {event.image && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-gray-800 leading-tight">{event.title}</h4>
                        <Badge 
                          variant={event.isPrivate ? "secondary" : "outline"}
                          className={`${event.isPrivate 
                            ? "bg-orange-100 text-orange-700 border-orange-200" 
                            : "bg-green-100 text-green-700 border-green-200"
                          } text-xs`}
                        >
                          {event.isPrivate ? "Privado" : "Público"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      </div>

                      {event.attendingPets && event.attendingPets.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {event.attendingPets.slice(0, 3).map((pet, petIndex) => (
                              <Avatar
                                key={petIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewPetProfile(pet);
                                }}
                                className="w-6 h-6 border border-white ring-1 ring-gray-200 cursor-pointer hover:scale-110 transition-transform"
                              >
                                <AvatarImage src={pet.avatar} alt={pet.name} />
                                <AvatarFallback className="text-xs bg-purple-200 text-purple-700">
                                  {pet.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {event.attendees} mascota{event.attendees > 1 ? 's' : ''} confirmada{event.attendees > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}