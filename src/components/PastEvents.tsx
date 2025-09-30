import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, Users, Star, Images, Globe, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { eventsApi } from "../services/api";
import { Event, User } from "../services/api";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
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
  images?: string[];
  reviews?: Review[];
}

interface PastEventsProps {
  onBack: () => void;
  onViewEvent: (event: Event) => void;
  onViewGallery: (event: Event) => void;
  currentUser: User;
}

const mockPastEvents: Event[] = [
  {
    id: "p1",
    title: "Paseo de primavera 2024",
    date: "2024-09-15",
    location: "Parque del Retiro",
    isPrivate: false,
    attendees: 28,
    description: "Un hermoso paseo primaveral con más de 25 mascotas felices.",
    organizer: "María González",
    image: "https://images.unsplash.com/photo-1596653048850-7918adea48b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nJTIwcGFya3xlbnwxfHx8fDE3NTkyMDc1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1596653048850-7918adea48b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nJTIwcGFya3xlbnwxfHx8fDE3NTkyMDc1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1679929577173-cd3630698d7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0cyUyMHBldHMlMjBvdXRkb29yfGVufDF8fHx8MTc1OTI0NDgxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1549366970-b62f33797001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjb3N0dW1lJTIwY29udGVzdCUyMHBhcnR5fGVufDF8fHx8MTc1OTI0NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "Luis Torres",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        comment: "¡Increíble evento! Mi perro se divirtió mucho y conoció nuevos amigos.",
        date: "2024-09-16"
      },
      {
        id: "r2", 
        userId: "u2",
        userName: "Ana Martín",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        comment: "Perfecto para socializar. Mi gata tímida se animó a jugar.",
        date: "2024-09-17"
      },
      {
        id: "r3",
        userId: "u3", 
        userName: "Carlos Ruiz",
        rating: 4,
        comment: "Muy bien organizado. Volveremos seguro.",
        date: "2024-09-18"
      }
    ]
  },
  {
    id: "p2",
    title: "Concurso de disfraces Halloween",
    date: "2024-08-31", 
    location: "Plaza Central",
    isPrivate: false,
    attendees: 45,
    description: "Un concurso divertidísimo con disfraces creativos y premios increíbles.",
    organizer: "Festival Mascotas",
    image: "https://images.unsplash.com/photo-1549366970-b62f33797001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjb3N0dW1lJTIwY29udGVzdCUyMHBhcnR5fGVufDF8fHx8MTc1OTI0NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1549366970-b62f33797001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjb3N0dW1lJTIwY29udGVzdCUyMHBhcnR5fGVufDF8fHx8MTc1OTI0NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1752834368595-87001d44ed9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRzJTIwdHJhaW5pbmclMjBjbGFzc3xlbnwxfHx8fDE3NTkyNDQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    reviews: [
      {
        id: "r4",
        userId: "u4",
        userName: "Sofia Méndez", 
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        rating: 5,
        comment: "¡Ganamos el primer lugar! La organización fue perfecta.",
        date: "2024-09-01"
      },
      {
        id: "r5",
        userId: "u5",
        userName: "Diego López",
        rating: 5,
        comment: "Los disfraces estuvieron increíbles. Muy divertido para toda la familia.",
        date: "2024-09-02"
      }
    ]
  },
  {
    id: "p3",
    title: "Taller de obediencia básica",
    date: "2024-08-10",
    location: "Centro Canino Pro",
    isPrivate: true,
    attendees: 12,
    description: "Sesión intensiva de entrenamiento que dio excelentes resultados.",
    organizer: "Ana Veterinaria",
    image: "https://images.unsplash.com/photo-1752834368595-87001d44ed9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRzJTIwdHJhaW5pbmclMjBjbGFzc3xlbnwxfHx8fDE3NTkyNDQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1752834368595-87001d44ed9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRzJTIwdHJhaW5pbmclMjBjbGFzc3xlbnwxfHx8fDE3NTkyNDQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    reviews: [
      {
        id: "r6",
        userId: "u6",
        userName: "Roberto Silva",
        rating: 4,
        comment: "Muy útil para entrenar a mi cachorro. Aprendió comandos básicos.",
        date: "2024-08-11"
      }
    ]
  }
];

export function PastEvents({ onBack, onViewEvent, onViewGallery, currentUser }: PastEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await eventsApi.getAll();
        setEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  // Helper functions to filter events
  const isMyPastEvent = (event: Event) => {
    if (!currentUser) return false;
    
    // Check if user's pet is attending the event
    const userPetIds = currentUser.pets?.map(pet => pet.id) || [];
    const attendingPetIds = event.attendingPets?.map(pet => pet.id) || [];
    
    return attendingPetIds.some(petId => userPetIds.includes(petId));
  };

  const getMyPastEvents = () => {
    if (!events) return [];
    // Filter for past events where user's pet attended
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date < today && isMyPastEvent(event));
  };

  const getOtherPastEvents = () => {
    if (!events) return [];
    // Filter for past events where user's pet did not attend
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date < today && !isMyPastEvent(event));
  };

  const myPastEvents = getMyPastEvents();
  const otherPastEvents = getOtherPastEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando eventos pasados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 rounded-2xl shadow-lg border border-red-200">
          <p className="text-red-600 text-xl font-semibold mb-4">Error al cargar eventos pasados</p>
          <p className="text-gray-700">{error}</p>
          <Button onClick={() => { window.location.reload(); }} className="mt-6 bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 py-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4 p-2 hover:bg-white/50 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Eventos Pasados</h1>
            <p className="text-gray-600">Revive los mejores momentos</p>
          </div>
        </div>

        {/* Mis Eventos Pasados Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🐾 Mis Eventos Pasados</h2>
            <p className="text-gray-600">Eventos a los que asististe con tu mascota</p>
          </div>
          
          {myPastEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <div className="text-4xl mb-4">🐾</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No tienes eventos pasados</h3>
                <p className="text-gray-600">Los eventos a los que asistas aparecerán aquí</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myPastEvents.map((event) => (
            <Card 
              key={event.id}
              className="bg-white/80 backdrop-blur-sm border-white/20 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Event Image with Gallery Button */}
              {event.image && (
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Gallery Button */}
                  {event.images && event.images.length > 1 && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewGallery(event);
                      }}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-700 border-0 rounded-xl px-3 py-1 text-sm backdrop-blur-sm"
                    >
                      <Images className="w-4 h-4 mr-1" />
                      {event.images.length} fotos
                    </Button>
                  )}

                  {/* Date Badge */}
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 border-white/30 backdrop-blur-sm">
                    {new Date(event.date).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Badge>

                  {/* Public/Private Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={event.isPrivate ? "secondary" : "outline"}
                      className={`${event.isPrivate 
                        ? "bg-orange-100/90 text-orange-700 border-orange-200 backdrop-blur-sm" 
                        : "bg-green-100/90 text-green-700 border-green-200 backdrop-blur-sm"
                      }`}
                    >
                      {event.isPrivate ? <Lock className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
                      {event.isPrivate ? "Privado" : "Público"}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Event Header */}
                <div>
                  <h3 className="text-gray-800 leading-tight mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500">por {event.organizer}</p>
                </div>

                {/* Event Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    {event.attendees} asistieron
                  </div>
                </div>

                {/* Reviews Section */}
                {event.reviews && event.reviews.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    {/* Average Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.round(getAverageRating(event.reviews!)) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {getAverageRating(event.reviews).toFixed(1)} ({event.reviews.length} reseñas)
                        </span>
                      </div>
                    </div>

                    {/* Latest Review */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={event.reviews[0].userAvatar} alt={event.reviews[0].userName} />
                          <AvatarFallback className="text-xs bg-purple-200 text-purple-700">
                            {event.reviews[0].userName.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{event.reviews[0].userName}</span>
                        <div className="flex items-center ml-auto">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < event.reviews![0].rating 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">"{event.reviews[0].comment}"</p>
                    </div>
                  </div>
                )}

                {/* View Event Button */}
                <Button
                  onClick={() => onViewEvent(event)}
                  variant="outline"
                  className="w-full bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
                >
                  Ver detalles
                </Button>
              </div>
            </Card>
          ))}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center my-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="mx-4 text-gray-400 text-sm font-medium">•</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Otros Eventos Pasados Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📅 Otros Eventos Pasados</h2>
            <p className="text-gray-600">Eventos pasados que no asististe</p>
          </div>
          
          {otherPastEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay otros eventos pasados</h3>
                <p className="text-gray-600">Vuelve más tarde para ver nuevos eventos pasados</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherPastEvents.map((event) => (
            <Card 
              key={event.id}
              className="bg-white/80 backdrop-blur-sm border-white/20 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Event Image with Gallery Button */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant={event.isPrivate ? "secondary" : "outline"}
                    className={`${event.isPrivate 
                      ? "bg-orange-100/90 text-orange-700 border-orange-200 backdrop-blur-sm" 
                      : "bg-green-100/90 text-green-700 border-green-200 backdrop-blur-sm"
                    }`}
                  >
                    {event.isPrivate ? <Lock className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
                    {event.isPrivate ? "Privado" : "Público"}
                  </Badge>
                </div>
                {event.images && event.images.length > 0 && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewGallery(event);
                    }}
                    className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white border-0 rounded-lg px-3 py-1"
                  >
                    <Images className="w-4 h-4 mr-1" />
                    {event.images.length}
                  </Button>
                )}
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{event.attendees} asistentes</span>
                  </div>
                </div>

                {/* Reviews Section */}
                {event.reviews && event.reviews.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    {/* Average Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.round(getAverageRating(event.reviews!)) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {getAverageRating(event.reviews!).toFixed(1)} ({event.reviews!.length} reseñas)
                        </span>
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    {event.reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback className="text-xs">
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-700">{review.userName}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating 
                                  ? "text-yellow-400 fill-current" 
                                  : "text-gray-300"
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => onViewEvent(event)}
                  variant="outline"
                  className="w-full bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
                >
                  Ver detalles
                </Button>
              </div>
            </Card>
          ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}