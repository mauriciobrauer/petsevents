import { ArrowLeft, Edit, Calendar, MapPin, Users, Star, Heart, Award, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
}

interface PetProfileProps {
  pet: Pet;
  currentUser: User | null;
  onBack: () => void;
  onViewEvent: (event: Event) => void;
  onEditProfile: (pet: Pet) => void;
}

const mockPetEvents: Event[] = [
  {
    id: "1",
    title: "Paseo grupal en el parque",
    date: "2024-10-15",
    location: "Parque Central",
    isPrivate: false,
    attendees: 12,
    description: "Un paseo relajante con nuestras mascotas en el parque más grande de la ciudad.",
    organizer: "María González",
    image: "https://images.unsplash.com/photo-1596653048850-7918adea48b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nJTIwcGFya3xlbnwxfHx8fDE3NTkyMDc1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "p1",
    title: "Paseo de primavera 2024",
    date: "2024-09-15",
    location: "Parque del Retiro",
    isPrivate: false,
    attendees: 28,
    description: "Un hermoso paseo primaveral con más de 25 mascotas felices.",
    organizer: "María González",
    image: "https://images.unsplash.com/photo-1596653048850-7918adea48b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nJTIwcGFya3xlbnwxfHx8fDE3NTkyMDc1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
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
    image: "https://images.unsplash.com/photo-1549366970-b62f33797001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjb3N0dW1lJTIwY29udGVzdCUyMHBhcnR5fGVufDF8fHx8MTc1OTI0NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function PetProfile({ pet, currentUser, onBack, onViewEvent, onEditProfile }: PetProfileProps) {
  // Verificar si la mascota pertenece al usuario actual
  const isMyPet = currentUser && currentUser.pets && currentUser.pets.some(userPet => userPet.id === pet.id);

  const getPersonalityIcon = (personality: string) => {
    if (personality.toLowerCase().includes("amigable") || personality.toLowerCase().includes("social")) {
      return <Heart className="w-4 h-4 text-pink-500" />;
    }
    if (personality.toLowerCase().includes("enérgico") || personality.toLowerCase().includes("activo")) {
      return <Award className="w-4 h-4 text-orange-500" />;
    }
    return <Star className="w-4 h-4 text-yellow-500" />;
  };

  const getTypeEmoji = (type: string) => {
    if (type.toLowerCase() === "perro") return "🐕";
    if (type.toLowerCase() === "gato") return "🐱";
    return "🐾";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4 p-2 hover:bg-white/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-gray-800">Perfil de Mascota</h1>
            <p className="text-gray-600">Información y actividades</p>
          </div>
        </div>

        {/* Pet Profile Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-8 mb-6">
          {/* Pet Avatar and Basic Info */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={pet.avatar} alt={pet.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-purple-200 to-pink-200 text-purple-700 text-2xl">
                  {getTypeEmoji(pet.type)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 border-white/50 rounded-full px-3 py-1 text-xs hover:bg-white"
              >
                <Camera className="w-3 h-3 mr-1" />
                Cambiar foto
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <h2 className="text-gray-800 mb-1">{pet.name}</h2>
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                  {getTypeEmoji(pet.type)} {pet.type}
                </Badge>
              </div>
              
              <p className="text-gray-600">De {pet.ownerName}</p>
            </div>
          </div>

          {/* Pet Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-2xl mb-2">🎂</div>
              <p className="text-sm text-gray-600">Edad</p>
              <p className="text-gray-800">{pet.age} {pet.age === 1 ? 'año' : 'años'}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="text-2xl mb-2">🧬</div>
              <p className="text-sm text-gray-600">Raza</p>
              <p className="text-gray-800">{pet.breed}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
              <div className="flex justify-center mb-2">
                {getPersonalityIcon(pet.personality)}
              </div>
              <p className="text-sm text-gray-600">Personalidad</p>
              <p className="text-gray-800 text-sm leading-tight">{pet.personality}</p>
            </div>
          </div>

          {/* Edit Profile Button - Solo visible si es mi mascota */}
          {isMyPet && (
            <Button
              onClick={() => onEditProfile(pet)}
              variant="outline"
              className="w-full bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar perfil
            </Button>
          )}
        </Card>

        {/* Events Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6">
          <h2 className="text-gray-800 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Eventos de {pet.name}
          </h2>

          <div className="space-y-4">
            {mockPetEvents.map((event, index) => (
              <Card 
                key={event.id}
                className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                onClick={() => onViewEvent(event)}
              >
                <div className="flex items-start space-x-4">
                  {/* Event Image */}
                  {event.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-800 leading-tight">{event.title}</h3>
                      {index === 0 && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs ml-2">
                          Próximo
                        </Badge>
                      )}
                      {index > 0 && (
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs ml-2">
                          Pasado
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-3 h-3 mr-2 text-purple-500" />
                        {new Date(event.date).toLocaleDateString('es-ES', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-3 h-3 mr-2 text-pink-500" />
                        {event.location}
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-3 h-3 mr-2 text-blue-500" />
                        {event.attendees} mascotas
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State if no events */}
          {mockPetEvents.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🗓️</div>
              <h3 className="text-gray-600 mb-2">No hay eventos aún</h3>
              <p className="text-gray-500 text-sm">Los eventos de {pet.name} aparecerán aquí.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}