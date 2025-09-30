import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, User, Mail, Instagram, Plus, Heart, Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { User as UserType, Pet } from "../services/api";

interface EditUserProfileProps {
  currentUser: UserType;
  onBack: () => void;
  onSave: (updatedUser: UserType) => void;
  onAddPet?: () => void;
  onEditPet?: (pet: Pet) => void;
}

export function EditUserProfile({ currentUser, onBack, onSave, onAddPet, onEditPet }: EditUserProfileProps) {
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    instagram: (currentUser as any).instagram || "",
    aboutMe: (currentUser as any).aboutMe || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (formData.instagram && !/^@?[a-zA-Z0-9._]+$/.test(formData.instagram.replace('@', ''))) {
      newErrors.instagram = "El usuario de Instagram no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedUser: UserType = {
        ...currentUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        instagram: formData.instagram.trim(),
        aboutMe: formData.aboutMe.trim(),
      } as any;

      onSave(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = () => {
    if (selectedImage) {
      // In a real app, you would upload to a server here
      // For now, we'll just use the preview as the new avatar
      const updatedUser: UserType = {
        ...currentUser,
        avatar: previewImage || currentUser.avatar,
      } as any;
      
      onSave(updatedUser);
      setIsDialogOpen(false);
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Editar Perfil</h1>
            <p className="text-gray-600">Actualiza tu información personal</p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-white/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="group relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow cursor-pointer">
                      <AvatarImage src={currentUser.avatar} alt={formData.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl">
                        {formData.name[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-sm w-full max-w-[400px] mx-auto">
                  <DialogHeader>
                    <DialogTitle>Cambiar Foto de Perfil</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-3">
                    {/* Preview */}
                    <div className="flex justify-center">
                      <Avatar className="w-20 h-20 border-2 border-gray-200">
                        <AvatarImage 
                          src={previewImage || currentUser.avatar} 
                          alt="Preview" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                          {formData.name[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* File Input */}
                    <div className="space-y-2">
                      <Label htmlFor="avatar-upload" className="text-sm font-medium">
                        Seleccionar imagen
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        ref={fileInputRef}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      <p className="text-xs text-gray-500">
                        Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      {selectedImage && (
                        <Button
                          variant="outline"
                          onClick={handleRemoveImage}
                          className="px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={handleUploadImage}
                        disabled={!selectedImage}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Imagen
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <p className="text-sm text-gray-500 text-center">
                Foto de Perfil
              </p>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                <User className="w-4 h-4 inline mr-2" />
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400 ${
                  errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                }`}
                placeholder="Ingresa tu nombre completo"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 inline mr-2" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400 ${
                  errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Instagram Field */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                <Instagram className="w-4 h-4 inline mr-2" />
                Instagram
              </Label>
              <Input
                id="instagram"
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className={`bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400 ${
                  errors.instagram ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                }`}
                placeholder="@tu_usuario"
              />
              {errors.instagram && (
                <p className="text-sm text-red-500">{errors.instagram}</p>
              )}
              <p className="text-xs text-gray-500">
                Opcional: Tu usuario de Instagram (con o sin @)
              </p>
            </div>

            {/* About Me Field */}
            <div className="space-y-2">
              <Label htmlFor="aboutMe" className="text-sm font-medium text-gray-700">
                <Heart className="w-4 h-4 inline mr-2" />
                Acerca de mí
              </Label>
              <Textarea
                id="aboutMe"
                value={formData.aboutMe}
                onChange={(e) => handleInputChange("aboutMe", e.target.value)}
                className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400 min-h-[120px] resize-y"
                placeholder="Cuéntanos un poco sobre ti y tu pasión por las mascotas..."
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Opcional: Comparte algo sobre ti y tus mascotas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 bg-white/80 border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* My Pets Section */}
        <Card className="mt-6 p-6 bg-white/80 backdrop-blur-sm border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">🐾 Mis Mascotas</h2>
            {onAddPet && (
              <Button
                onClick={onAddPet}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Mascota
              </Button>
            )}
          </div>

          {currentUser.pets && currentUser.pets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {currentUser.pets.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={pet.avatar} alt={pet.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                      {pet.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {pet.type} • {pet.breed}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pet.age} años • {pet.personality}
                    </p>
                  </div>
                  {onEditPet && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPet(pet)}
                      className="bg-white/80 border-purple-200 hover:bg-purple-50"
                    >
                      Editar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No tienes mascotas registradas
              </h3>
              <p className="text-gray-600 mb-4">
                Agrega tu primera mascota para comenzar a participar en eventos
              </p>
              {onAddPet && (
                <Button
                  onClick={onAddPet}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar mi primera mascota
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50/80 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Información</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Tu nombre será visible en los eventos que organices</li>
            <li>• El email se usa para notificaciones importantes</li>
            <li>• Instagram aparecerá en tu perfil público</li>
            <li>• "Acerca de mí" se mostrará en tu perfil</li>
            <li>• Gestiona tus mascotas desde esta sección</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
