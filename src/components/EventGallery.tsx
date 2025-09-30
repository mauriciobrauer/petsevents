import { useState } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent } from "./ui/dialog";

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

interface EventGalleryProps {
  event: Event;
  onBack: () => void;
}

export function EventGallery({ event, onBack }: EventGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const images = event.images || [];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
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
            <h1 className="text-gray-800">{event.title}</h1>
            <p className="text-gray-600">
              {new Date(event.date).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {event.location}
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <Card 
              key={index}
              className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback
                  src={image}
                  alt={`${event.title} - Foto ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-gray-600 mb-2">No hay fotos disponibles</h3>
            <p className="text-gray-500">Las fotos de este evento aparecerán aquí.</p>
          </div>
        )}

        {/* Event Info Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6 mt-8">
          <div className="text-center space-y-2">
            <h2 className="text-gray-800">Sobre este evento</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{event.description}</p>
            <div className="flex justify-center items-center space-x-6 pt-4 text-sm text-gray-500">
              <span>Organizado por {event.organizer}</span>
              <span>•</span>
              <span>{event.attendees} asistentes</span>
              <span>•</span>
              <span>{images.length} fotos</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-6xl w-full h-full max-h-[90vh] p-0 bg-black/90 border-0">
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>
                </>
              )}

              {/* Image */}
              <div className="w-full h-full flex items-center justify-center p-8">
                <ImageWithFallback
                  src={images[selectedImageIndex]}
                  alt={`${event.title} - Foto ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                {selectedImageIndex + 1} de {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}