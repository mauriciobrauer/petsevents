import { ArrowLeft, Calendar, MapPin, Users, Share2, UserPlus, Lock, Globe, Star, UserMinus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { User } from "../services/api";

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

interface Review {
  id: string;
  petId: string;
  petName: string;
  petAvatar?: string;
  rating: number;
  comment: string;
  date: string;
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
  images?: string[];
  reviews?: Review[];
  attendingPets?: Pet[];
}

interface Attendee {
  id: string;
  name: string;
  avatar?: string;
}

interface EventDetailProps {
  event: Event;
  currentUser: User | null;
  onBack: () => void;
  onInviteFriends: () => void;
  onViewPetProfile: (pet: Pet) => void;
  onUnregisterPet: (eventId: string, petId: string) => void;
  onRegisterPet: (eventId: string, petId: string) => void;
}

const mockAttendees: Attendee[] = [
  { id: "1", name: "María González", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150" },
  { id: "2", name: "Carlos Ruiz" },
  { id: "3", name: "Ana Veterinaria", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: "4", name: "Luis Pérez" },
  { id: "5", name: "Sofia López", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
  { id: "6", name: "Diego Torres" },
  { id: "7", name: "Carmen Silva" },
  { id: "8", name: "Roberto Castro" }
];

export function EventDetail({ event, currentUser, onBack, onInviteFriends, onViewPetProfile, onUnregisterPet, onRegisterPet }: EventDetailProps) {
  // Verificar si la mascota del usuario ya está inscrita en el evento
  const isMyPetAttending = currentUser && currentUser.pets && currentUser.pets.some(pet => 
    event.attendingPets && event.attendingPets.some(attendingPet => attendingPet.id === pet.id)
  );

  // Obtener la mascota inscrita del usuario
  const myAttendingPet = currentUser && currentUser.pets && currentUser.pets.find(pet => 
    event.attendingPets && event.attendingPets.some(attendingPet => attendingPet.id === pet.id)
  );

  const handleUnregister = () => {
    if (myAttendingPet) {
      onUnregisterPet(event.id, myAttendingPet.id);
    }
  };

  const handleRegister = () => {
    // Si el usuario tiene mascotas, usar la primera
    if (currentUser && currentUser.pets && currentUser.pets.length > 0) {
      const petToRegister = currentUser.pets[0];
      onRegisterPet(event.id, petToRegister.id);
    }
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 hover:bg-white/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            
            <Button
              onClick={onInviteFriends}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invitar
            </Button>
          </div>
        </div>

        {/* Event Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden mb-6">
          {/* Event Image */}
          {event.image && (
            <div className="relative h-64 overflow-hidden">
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-4 right-4">
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

          <div className="p-8">
            {/* Event Header */}
            <div className="space-y-4 mb-6">
              <div>
                <h1 className="text-gray-800 mb-2">{event.title}</h1>
                <p className="text-gray-600">Organizado por {event.organizer}</p>
              </div>
            </div>

          {/* Event Details */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <Calendar className="w-5 h-5 mr-3 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="text-gray-800">
                  {new Date(event.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <MapPin className="w-5 h-5 mr-3 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Lugar</p>
                <p className="text-gray-800">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <Users className="w-5 h-5 mr-3 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Asistentes</p>
                <p className="text-gray-800">{event.attendees} confirmados</p>
              </div>
            </div>
          </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-gray-800">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
        </Card>

        {/* Join Event Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6 mb-6">
          <div className="text-center">
            {isMyPetAttending ? (
              <>
                <h2 className="text-gray-800 mb-4">¡Tu mascota ya está inscrita!</h2>
                <Button 
                  onClick={handleUnregister}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 rounded-xl h-14 mb-4"
                >
                  <UserMinus className="w-5 h-5 mr-2" />
                  Desafortunadamente ya no podré ir
                </Button>
                <p className="text-sm text-gray-600">
                  Tu mascota está inscrita junto con {event.attendees - 1} otras mascotas
                </p>
              </>
            ) : (
              <>
                <h2 className="text-gray-800 mb-4">¿Tu mascota quiere participar?</h2>
                <Button 
                  onClick={handleRegister}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl h-14 mb-4"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Inscribir mi mascota al evento
                </Button>
                <p className="text-sm text-gray-600">
                  Únete a {event.attendees} mascotas que ya van a este evento
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Attending Pets Section */}
        {event.attendingPets && event.attendingPets.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6 mb-6">
            <h2 className="text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Mascotas confirmadas ({event.attendingPets.length})
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.attendingPets.map((pet) => (
                <Card 
                  key={pet.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => onViewPetProfile(pet)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={pet.avatar} alt={pet.name} />
                      <AvatarFallback className="bg-blue-200 text-blue-700">
                        {pet.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-800 leading-tight">{pet.name}</h4>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                      <p className="text-xs text-gray-500">De {pet.ownerName}</p>
                    </div>
                    
                    <div className="text-2xl">
                      {pet.type?.toLowerCase() === "perro" ? "🐕" : pet.type?.toLowerCase() === "gato" ? "🐱" : "🐾"}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Pet Reviews Section */}
        {event.reviews && event.reviews.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6 mb-6">
            <h2 className="text-gray-800 mb-4">Comentarios de las mascotas ({event.reviews.length})</h2>
            
            <div className="space-y-4">
              {event.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <Avatar 
                      className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        // Find the pet and navigate to profile
                        const pet = event.attendingPets?.find(p => p.id === review.petId);
                        if (pet) onViewPetProfile(pet);
                      }}
                    >
                      <AvatarImage src={review.petAvatar} alt={review.petName} />
                      <AvatarFallback className="bg-purple-200 text-purple-700">
                        {review.petName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-gray-800">{review.petName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })} • {review.ownerName}
                          </p>
                        </div>
                        
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
                        <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Attendees */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6">
          <h2 className="text-gray-800 mb-4">Asistentes ({mockAttendees.length})</h2>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mockAttendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={attendee.avatar} alt={attendee.name} />
                  <AvatarFallback className="text-xs bg-purple-200 text-purple-700">
                    {attendee.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700 truncate">{attendee.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}