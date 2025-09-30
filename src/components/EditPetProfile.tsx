import { useState } from "react";
import { ArrowLeft, Camera, Save, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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

interface EditPetProfileProps {
  pet: Pet;
  currentUser: User | null;
  onBack: () => void;
  onSave: (updatedPet: Pet) => void;
}

export function EditPetProfile({ pet, currentUser, onBack, onSave }: EditPetProfileProps) {
  // Verificar si la mascota pertenece al usuario actual
  const isMyPet = currentUser && currentUser.pets && currentUser.pets.some(userPet => userPet.id === pet.id);

  // Si no es mi mascota, mostrar mensaje de error y botón para volver
  if (!isMyPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
              <p className="text-gray-600 mb-6">
                No tienes permisos para editar esta mascota. Solo puedes editar el perfil de tus propias mascotas.
              </p>
            </div>
            
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    name: pet.name,
    type: pet.type,
    breed: pet.breed,
    age: pet.age.toString(),
    personality: pet.personality,
    avatar: pet.avatar
  });

  const handleSave = () => {
    const updatedPet: Pet = {
      ...pet,
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: parseInt(formData.age),
      personality: formData.personality,
      avatar: formData.avatar
    };
    onSave(updatedPet);
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
              <h1 className="text-gray-800">Editar Perfil</h1>
              <p className="text-gray-600">Actualiza la información de tu mascota</p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
        </div>

        {/* Edit Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-8">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={formData.avatar} alt={formData.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-purple-200 to-pink-200 text-purple-700 text-2xl">
                  {getTypeEmoji(formData.type)}
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
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Pet Name */}
            <div>
              <Label htmlFor="name" className="text-gray-700 mb-2 block">
                Nombre de la mascota
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/70 border-gray-200 rounded-xl h-12"
                placeholder="Ej: Max, Luna, Rocky..."
              />
            </div>

            {/* Pet Type */}
            <div>
              <Label htmlFor="type" className="text-gray-700 mb-2 block">
                Tipo de mascota
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-white/70 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">🐕 Perro</SelectItem>
                  <SelectItem value="Gato">🐱 Gato</SelectItem>
                  <SelectItem value="Conejo">🐰 Conejo</SelectItem>
                  <SelectItem value="Hamster">🐹 Hamster</SelectItem>
                  <SelectItem value="Otro">🐾 Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pet Breed */}
            <div>
              <Label htmlFor="breed" className="text-gray-700 mb-2 block">
                Raza
              </Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="bg-white/70 border-gray-200 rounded-xl h-12"
                placeholder="Ej: Golden Retriever, Siamés, Mestizo..."
              />
            </div>

            {/* Pet Age */}
            <div>
              <Label htmlFor="age" className="text-gray-700 mb-2 block">
                Edad (años)
              </Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-white/70 border-gray-200 rounded-xl h-12"
                placeholder="Ej: 3"
              />
            </div>

            {/* Pet Personality */}
            <div>
              <Label htmlFor="personality" className="text-gray-700 mb-2 block">
                Personalidad y descripción
              </Label>
              <Textarea
                id="personality"
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                className="bg-white/70 border-gray-200 rounded-xl min-h-24 resize-none"
                placeholder="Describe la personalidad de tu mascota... Ej: Amigable y enérgico, le encanta jugar con otros perros"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar cambios
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}