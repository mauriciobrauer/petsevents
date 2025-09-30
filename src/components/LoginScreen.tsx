import { Button } from "./ui/button";
import { User } from "../services/api";
import { useState, useEffect } from "react";

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Fetching users from API...');
        
        // Test direct fetch
        const response = await fetch('http://localhost:3003/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const usersData = await response.json();
        console.log('Users data received:', usersData);
        console.log('Number of users:', usersData.length);
        
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = () => {
    if (!selectedUserId) return;
    
    const selectedUser = users?.find(user => user.id === selectedUserId);
    if (selectedUser) {
      // Guardar usuario en localStorage para persistencia
      localStorage.setItem('currentUser', JSON.stringify(selectedUser));
      onLogin(selectedUser);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
          <p className="text-sm text-gray-500 mt-2">Estado: {loading ? 'Cargando...' : 'Completado'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600">Error al cargar usuarios: {error}</p>
          <p className="text-sm text-gray-500 mt-2">Usuarios cargados: {users.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-xl border border-white/20">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1677144649437-df063a3e8fc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcGV0JTIwZG9nJTIwY2F0JTIwbG9nbyUyMG1hc2NvdHxlbnwxfHx8fDE3NTkyNDQzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Pet Events Logo"
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🐾</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-gray-800">Pet Events</h1>
            <p className="text-gray-600">Conecta con otros amantes de las mascotas</p>
          </div>

          {/* User Selection */}
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona tu usuario:
              </label>
              <div className="space-y-2">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedUserId === user.id
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-25'
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="text-left flex-1">
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.pets?.[0]?.name} ({user.pets?.[0]?.type})
                        </div>
                      </div>
                      {selectedUserId === user.id && (
                        <div className="text-purple-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Login Button */}
          <Button 
            onClick={handleLogin}
            disabled={!selectedUserId}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white border-0 rounded-2xl h-12 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Iniciar Sesión
          </Button>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Únete a la comunidad de mascotas más amigable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}