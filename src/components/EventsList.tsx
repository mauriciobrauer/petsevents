import React, { useState, useEffect } from "react";
import { Plus, MapPin, Users, Lock, Globe, Star, History } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { eventsApi, petsApi } from "../services/api";
import { Event, Pet, User } from "../services/api";

interface EventsListProps {
  onCreateEvent: () => void;
  onViewEvent: (event: Event) => void;
  onViewPastEvents: () => void;
  onViewPetProfile: (pet: Pet) => void;
  onEditUser: () => void;
  currentUser: User;
  onLogout: () => void;
}

export function EventsList({ onCreateEvent, onViewEvent, onViewPastEvents, onViewPetProfile, onEditUser, currentUser, onLogout }: EventsListProps) {
  const [events, setEvents] = useState([]);
  const [pets, setPets] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [petsError, setPetsError] = useState(null);

  // Helper functions to filter events
  const isMyEvent = (event: Event) => {
    if (!currentUser) return false;
    
    // Check if user's pet is attending the event
    const userPetIds = currentUser.pets?.map(pet => pet.id) || [];
    const attendingPetIds = event.attendingPets?.map(pet => pet.id) || [];
    
    return attendingPetIds.some(petId => userPetIds.includes(petId));
  };

  const getMyEvents = () => {
    if (!events) return [];
    return events.filter(isMyEvent);
  };

  const getOtherEvents = () => {
    if (!events) return [];
    return events.filter(event => !isMyEvent(event));
  };

  const myEvents = getMyEvents();
  const otherEvents = getOtherEvents();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError(null);
        const eventsData = await eventsApi.getAll();
        setEvents(eventsData);
      } catch (err) {
        setEventsError(err instanceof Error ? err.message : 'Error loading events');
        console.error('Error fetching events:', err);
      } finally {
        setEventsLoading(false);
      }
    };

    const fetchPets = async () => {
      try {
        setPetsLoading(true);
        setPetsError(null);
        const petsData = await petsApi.getAll();
        setPets(petsData);
      } catch (err) {
        setPetsError(err instanceof Error ? err.message : 'Error loading pets');
        console.error('Error fetching pets:', err);
      } finally {
        setPetsLoading(false);
      }
    };

    fetchEvents();
    fetchPets();
  }, []);

  const refetchEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      const eventsData = await eventsApi.getAll();
      setEvents(eventsData);
    } catch (err) {
      setEventsError(err instanceof Error ? err.message : 'Error loading events');
      console.error('Error fetching events:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  if (eventsLoading || petsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (eventsError || petsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar los datos</h2>
          <p className="text-gray-600 mb-4">{eventsError || petsError}</p>
          <Button onClick={() => { refetchEvents(); }} className="bg-purple-500 hover:bg-purple-600">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const myPet = currentUser?.pets?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto pt-8 pb-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🐾</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Pet Events</h1>
              <p className="text-gray-600">¡Encuentra eventos increíbles para tu mascota!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* User Info */}
            <button 
              onClick={onEditUser}
              className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-2 border border-purple-200 hover:bg-purple-50 transition-colors h-10 min-w-[120px] justify-center"
            >
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">{currentUser.name}</span>
            </button>
            
            {/* My Pet Button */}
            {myPet && (
          <Button
            variant="outline"
                onClick={() => onViewPetProfile(myPet)}
            className="px-4 py-2 rounded-lg bg-white/80 border-purple-200 hover:bg-purple-50 h-10 min-w-[120px]"
          >
            <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={myPet.avatar} alt={myPet.name} />
              <AvatarFallback className="bg-purple-200 text-purple-700 text-xs">
                    {myPet.name[0]}
              </AvatarFallback>
            </Avatar>
            Mi(s) Mascota(s)
          </Button>
            )}
          
            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-white/80 border-red-200 hover:bg-red-50 text-red-600 h-10 min-w-[120px]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600">Descubre actividades increíbles cerca de ti</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-white/30">
            <Button
              variant="ghost"
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg px-4 py-2 text-sm"
            >
              Próximos
            </Button>
            <Button
              variant="ghost"
              onClick={onViewPastEvents}
              className="text-gray-600 hover:bg-white/50 rounded-lg px-4 py-2 text-sm"
            >
              <History className="w-4 h-4 mr-2" />
              Pasados
            </Button>
          </div>
        </div>


        {/* Mis Eventos Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">🐾 Mis Eventos</h2>
              <p className="text-gray-600">Eventos donde tu mascota está registrada</p>
            </div>
            <Button
              onClick={onCreateEvent}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Evento
            </Button>
          </div>
          
          {myEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <div className="text-4xl mb-4">🐾</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No tienes eventos próximos</h3>
                <p className="text-gray-600 mb-4">Crea un nuevo evento o únete a uno existente</p>
                <Button
                  onClick={onCreateEvent}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear mi primer evento
            </Button>
          </div>
        </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myEvents?.map((event) => (
            <Card 
              key={event.id}
              className="bg-white/80 backdrop-blur-sm border-white/20 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => onViewEvent(event)}
            >
              {/* Event Image */}
              {event.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
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
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="text-purple-500 mr-2">📅</span>
                    <span>{event.date} {event.time && `• ${event.time}`}</span>
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

                {/* Attending Pets */}
                {event.attendingPets && event.attendingPets.length > 0 && (
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">Mascotas asistentes:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.attendingPets.slice(0, 3).map((pet) => (
                        <div key={pet.id} className="flex items-center space-x-1">
                          <img
                            src={pet.avatar || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=24&h=24&fit=crop&crop=face"}
                            alt={pet.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs text-gray-600">{pet.name}</span>
                        </div>
                      ))}
                      {event.attendingPets.length > 3 && (
                        <span className="text-xs text-gray-500">+{event.attendingPets.length - 3} más</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {event.reviewCount > 0 && (
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">
                          {event.averageRating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ({event.reviewCount} reseña{event.reviewCount !== 1 ? 's' : ''})
                      </div>
                    </div>
                  </div>
                )}
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

        {/* Otros Eventos Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📅 Otros Eventos</h2>
            <p className="text-gray-600">Eventos disponibles donde puedes registrar tu mascota</p>
          </div>
          
          {otherEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay otros eventos disponibles</h3>
                <p className="text-gray-600">Vuelve más tarde para ver nuevos eventos</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherEvents?.map((event) => (
            <Card 
              key={event.id}
              className="bg-white/80 backdrop-blur-sm border-white/20 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => onViewEvent(event)}
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop"}
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
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="text-purple-500 mr-2">📅</span>
                    <span>{event.date} {event.time && `• ${event.time}`}</span>
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

                {/* Attending Pets */}
                {event.attendingPets && event.attendingPets.length > 0 && (
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">Mascotas asistentes:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.attendingPets.slice(0, 3).map((pet) => (
                        <div key={pet.id} className="flex items-center space-x-1">
                          <img
                            src={pet.avatar || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=24&h=24&fit=crop&crop=face"}
                            alt={pet.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs text-gray-600">{pet.name}</span>
                        </div>
                      ))}
                      {event.attendingPets.length > 3 && (
                        <span className="text-xs text-gray-500">+{event.attendingPets.length - 3} más</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {event.reviewCount > 0 && (
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">
                          {event.averageRating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ({event.reviewCount} reseña{event.reviewCount !== 1 ? 's' : ''})
                      </div>
                    </div>
                  </div>
                )}
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