import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { EventsList } from "./components/EventsList";
import { CreateEvent } from "./components/CreateEvent";
import { EventDetail } from "./components/EventDetail";
import { InviteFriends } from "./components/InviteFriends";
import { PastEvents } from "./components/PastEvents";
import { EventGallery } from "./components/EventGallery";
import { PetProfile } from "./components/PetProfile";
import { EditPetProfile } from "./components/EditPetProfile";
import { EditUserProfile } from "./components/EditUserProfile";
import { ConfirmationDialog } from "./components/ConfirmationDialog";
import { useConfirmationDialog } from "./hooks/useConfirmationDialog";
import { Pet, Event, Review, User } from "./services/api";

type Screen = "login" | "events" | "create" | "detail" | "invite" | "past-events" | "gallery" | "pet-profile" | "edit-pet" | "edit-user";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { isOpen, options, hideDialog, showSuccess, showError, showInfo } = useConfirmationDialog();

  // Verificar si hay un usuario logueado al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setCurrentScreen("events");
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen("events");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentScreen("login");
  };

  const handleCreateEvent = () => {
    setCurrentScreen("create");
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setCurrentScreen("detail");
  };

  const handleInviteFriends = () => {
    setCurrentScreen("invite");
  };

  const handleViewPastEvents = () => {
    setCurrentScreen("past-events");
  };

  const handleEditUser = () => {
    setCurrentScreen("edit-user");
  };

  const handleSaveUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentScreen("events");
  };


  const handleViewGallery = (event: Event) => {
    setSelectedEvent(event);
    setCurrentScreen("gallery");
  };

  const handleViewPetProfile = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentScreen("pet-profile");
  };

  const handleEditPetProfile = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentScreen("edit-pet");
  };

  const handleBack = () => {
    if (currentScreen === "create" || currentScreen === "detail" || currentScreen === "invite") {
      setCurrentScreen("events");
    } else if (currentScreen === "past-events" || currentScreen === "gallery") {
      setCurrentScreen("events");
    } else if (currentScreen === "pet-profile" || currentScreen === "edit-pet") {
      setCurrentScreen("events");
    } else if (currentScreen === "edit-user") {
      setCurrentScreen("events");
    } else if (currentScreen === "calendar") {
      setCurrentScreen("events");
    }
  };

  const handleEventCreated = () => {
    // Show success message or go to the new event detail
    setCurrentScreen("events");
  };

  const handleInvitesSent = () => {
    // Show success message and go back to event detail
    setCurrentScreen("detail");
  };

  const handleUnregisterPet = async (eventId: string, petId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/api/events/${eventId}/attend/${petId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Mostrar mensaje de confirmación
        showSuccess('¡Desinscripción exitosa!', 'Tu mascota ya no acudirá al evento. ¡Esperamos verte en el próximo!');
        // Regresar a la página principal después de desinscribir
        setCurrentScreen("events");
      } else {
        console.error('Error al desinscribir mascota del evento');
        showError('Error al desinscribir', 'No se pudo desinscribir la mascota. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al desinscribir mascota del evento:', error);
      showError('Error de conexión', 'No se pudo conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  const handleRegisterPet = async (eventId: string, petId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/api/events/${eventId}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petId }),
      });

      if (response.ok) {
        // Mostrar mensaje de confirmación
        showSuccess('¡Inscripción exitosa!', 'Tu mascota se ha inscrito exitosamente al evento.');
        // Regresar a la página principal después de inscribir
        setCurrentScreen("events");
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          showInfo('Ya inscrita', 'Tu mascota ya está inscrita en este evento.');
        } else {
          console.error('Error al inscribir mascota al evento');
          showError('Error al inscribir', 'No se pudo inscribir la mascota. Inténtalo de nuevo.');
        }
      }
    } catch (error) {
      console.error('Error al inscribir mascota al evento:', error);
      showError('Error de conexión', 'No se pudo conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="size-full">
      {currentScreen === "login" && (
        <LoginScreen onLogin={handleLogin} />
      )}
      
      {currentScreen === "events" && currentUser && (
        <EventsList 
          onCreateEvent={handleCreateEvent}
          onViewEvent={handleViewEvent}
          onViewPastEvents={handleViewPastEvents}
          onViewPetProfile={handleViewPetProfile}
          onEditUser={handleEditUser}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === "create" && (
        <CreateEvent 
          onBack={handleBack}
          onEventCreated={handleEventCreated}
        />
      )}
      
      {currentScreen === "detail" && selectedEvent && (
        <EventDetail 
          event={selectedEvent}
          currentUser={currentUser}
          onBack={handleBack}
          onInviteFriends={handleInviteFriends}
          onViewPetProfile={handleViewPetProfile}
          onUnregisterPet={handleUnregisterPet}
          onRegisterPet={handleRegisterPet}
        />
      )}
      
      {currentScreen === "invite" && (
        <InviteFriends 
          onBack={handleBack}
          onInvitesSent={handleInvitesSent}
        />
      )}

      {currentScreen === "past-events" && currentUser && (
        <PastEvents 
          onBack={handleBack}
          onViewEvent={handleViewEvent}
          onViewGallery={handleViewGallery}
          currentUser={currentUser}
        />
      )}

      {currentScreen === "gallery" && selectedEvent && (
        <EventGallery 
          event={selectedEvent}
          onBack={handleBack}
        />
      )}

      {currentScreen === "pet-profile" && selectedPet && (
        <PetProfile 
          pet={selectedPet}
          currentUser={currentUser}
          onBack={handleBack}
          onViewEvent={handleViewEvent}
          onEditProfile={handleEditPetProfile}
        />
      )}

      {currentScreen === "edit-pet" && selectedPet && (
        <EditPetProfile 
          pet={selectedPet}
          currentUser={currentUser}
          onBack={handleBack}
          onSave={(updatedPet) => {
            setSelectedPet(updatedPet);
            setCurrentScreen("pet-profile");
          }}
        />
      )}

      {currentScreen === "edit-user" && currentUser && (
        <EditUserProfile 
          currentUser={currentUser}
          onBack={handleBack}
          onSave={handleSaveUser}
          onAddPet={() => {
            setCurrentScreen("create");
          }}
          onEditPet={(pet) => {
            setSelectedPet(pet);
            setCurrentScreen("edit-pet");
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isOpen}
        type={options.type}
        title={options.title}
        message={options.message}
        onClose={hideDialog}
        autoClose={options.autoClose}
        duration={options.duration}
      />
    </div>
  );
}