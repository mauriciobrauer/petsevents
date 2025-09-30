import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, FileText, Users, Lock, Globe, Upload, X, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApiMutation } from "../hooks/useApi";
import { eventsApi } from "../services/api";
import { Event } from "../services/api";

interface CreateEventProps {
  onBack: () => void;
  onEventCreated: () => void;
}

export function CreateEvent({ onBack, onEventCreated }: CreateEventProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    isPrivate: false,
    eventType: "general"
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const { mutate: createEvent, loading, error } = useApiMutation(eventsApi.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      isPrivate: formData.isPrivate,
      organizer: "Usuario Actual", // In a real app, this would come from authentication
      image: uploadedImages[0] || undefined,
      eventType: formData.eventType,
      attendees: 0
    };

    const result = await createEvent(eventData);
    if (result) {
      onEventCreated();
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload these files to a server
      // For demo purposes, we'll use placeholder images
      const newImages = Array.from(files).map((_, index) => 
        `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`
      );
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4">
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
            <h1 className="text-gray-800">Crear Nuevo Evento</h1>
            <p className="text-gray-600">Organiza una actividad para mascotas</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-purple-500" />
                Título del evento
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Ej: Paseo grupal en el parque"
                className="bg-white/70 border-gray-200 rounded-xl h-12"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-blue-500" />
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe tu evento, qué actividades habrá, qué deben traer..."
                className="bg-white/70 border-gray-200 rounded-xl min-h-24 resize-none"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="bg-white/70 border-gray-200 rounded-xl h-12"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="bg-white/70 border-gray-200 rounded-xl h-12"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-green-500" />
                Lugar
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Ej: Parque Central, Av. Principal 123"
                className="bg-white/70 border-gray-200 rounded-xl h-12"
                required
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType" className="flex items-center text-gray-700">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                Tipo de evento
              </Label>
              <Select value={formData.eventType} onValueChange={(value) => handleChange("eventType", value)}>
                <SelectTrigger className="bg-white/70 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder="Selecciona el tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="paseo">Paseo</SelectItem>
                  <SelectItem value="entrenamiento">Entrenamiento</SelectItem>
                  <SelectItem value="concurso">Concurso</SelectItem>
                  <SelectItem value="adopcion">Adopción</SelectItem>
                  <SelectItem value="fiesta">Fiesta</SelectItem>
                  <SelectItem value="socializacion">Socialización</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-center space-x-3">
                {formData.isPrivate ? (
                  <Lock className="w-5 h-5 text-orange-500" />
                ) : (
                  <Globe className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <Label className="text-gray-700">
                    {formData.isPrivate ? "Evento Privado" : "Evento Público"}
                  </Label>
                  <p className="text-sm text-gray-600">
                    {formData.isPrivate 
                      ? "Solo invitados pueden ver y asistir"
                      : "Cualquiera puede ver y unirse"
                    }
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleChange("isPrivate", checked)}
                className="data-[state=checked]:bg-orange-400"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label className="flex items-center text-gray-700">
                <Upload className="w-4 h-4 mr-2 text-green-500" />
                Fotos del evento
              </Label>
              
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">Haz clic para subir fotos</p>
                  <p className="text-sm text-gray-500">PNG, JPG hasta 10MB cada una</p>
                </label>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <ImageWithFallback
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Button */}
            {formData.title && formData.description && (
              <Button
                type="button"
                onClick={togglePreview}
                variant="outline"
                className="w-full bg-white/70 border-gray-200 rounded-xl hover:bg-white/90"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista previa del evento
              </Button>
            )}

            {/* Submit Button */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">Error: {error}</p>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl h-12 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creando evento...</span>
                </div>
              ) : (
                "Crear Evento"
              )}
            </Button>
          </form>
        </Card>

        {/* Preview Modal */}
        {showPreview && (
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 rounded-2xl p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800">Vista previa</h2>
              <Button
                variant="ghost"
                onClick={togglePreview}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="border rounded-xl overflow-hidden bg-white">
              {/* Preview Image */}
              {uploadedImages.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={uploadedImages[0]}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-gray-800 leading-tight mb-1">{formData.title}</h3>
                  <p className="text-sm text-gray-500">Organizado por ti</p>
                </div>

                <div className="space-y-2">
                  {formData.date && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      {new Date(formData.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} {formData.time && `a las ${formData.time}`}
                    </div>
                  )}
                  
                  {formData.location && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                      {formData.location}
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    0 asistentes (recién creado)
                  </div>
                </div>

                {formData.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{formData.description}</p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}