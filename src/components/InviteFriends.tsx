import { useState } from "react";
import { ArrowLeft, Search, Mail, UserPlus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isRegistered: boolean;
}

interface InviteFriendsProps {
  onBack: () => void;
  onInvitesSent: () => void;
}

const mockUsers: User[] = [
  { id: "1", name: "Pedro Martínez", email: "pedro@email.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", isRegistered: true },
  { id: "2", name: "Laura Jiménez", email: "laura@email.com", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150", isRegistered: true },
  { id: "3", name: "Miguel Santos", email: "miguel@email.com", isRegistered: true },
  { id: "4", name: "Elena Morales", email: "elena@email.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", isRegistered: true },
  { id: "5", name: "Antonio Vega", email: "antonio@email.com", isRegistered: true }
];

export function InviteFriends({ onBack, onInvitesSent }: InviteFriendsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [emailInvite, setEmailInvite] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [emailInvites, setEmailInvites] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const addEmailInvite = () => {
    if (emailInvite && emailInvite.includes("@") && !emailInvites.includes(emailInvite)) {
      setEmailInvites([...emailInvites, emailInvite]);
      setEmailInvite("");
    }
  };

  const removeEmailInvite = (email: string) => {
    setEmailInvites(emailInvites.filter(e => e !== email));
  };

  const handleSendInvites = () => {
    if (selectedUsers.size > 0 || emailInvites.length > 0) {
      console.log("Sending invites to:", {
        registeredUsers: Array.from(selectedUsers),
        emailInvites: emailInvites
      });
      onInvitesSent();
    }
  };

  const totalInvites = selectedUsers.size + emailInvites.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
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
              <h1 className="text-gray-800">Invitar Amigos</h1>
              <p className="text-gray-600">Comparte este evento con otros</p>
            </div>
          </div>
          
          {totalInvites > 0 && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              {totalInvites} seleccionados
            </Badge>
          )}
        </div>

        {/* Search Registered Users */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <UserPlus className="w-5 h-5 text-teal-500" />
              <h2 className="text-gray-800">Buscar usuarios registrados</h2>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="pl-10 bg-white/70 border-gray-200 rounded-xl h-12"
              />
            </div>

            {searchTerm && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      selectedUsers.has(user.id)
                        ? "bg-gradient-to-r from-teal-100 to-cyan-100 border-2 border-teal-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-sm bg-teal-200 text-teal-700">
                          {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    {selectedUsers.has(user.id) && (
                      <Check className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No se encontraron usuarios
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Email Invitations */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-purple-500" />
              <h2 className="text-gray-800">Invitar por email</h2>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={emailInvite}
                onChange={(e) => setEmailInvite(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addEmailInvite()}
                placeholder="email@ejemplo.com"
                className="bg-white/70 border-gray-200 rounded-xl h-12 flex-1"
              />
              <Button
                onClick={addEmailInvite}
                disabled={!emailInvite || !emailInvite.includes("@")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl h-12 px-6"
              >
                Agregar
              </Button>
            </div>

            {emailInvites.length > 0 && (
              <div className="space-y-2">
                <Label className="text-gray-700">Emails para invitar:</Label>
                <div className="flex flex-wrap gap-2">
                  {emailInvites.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-200"
                      onClick={() => removeEmailInvite(email)}
                    >
                      {email} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Send Invitations Button */}
        <Button
          onClick={handleSendInvites}
          disabled={totalInvites === 0}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 rounded-xl h-12 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {totalInvites > 0 
            ? `Enviar ${totalInvites} invitación${totalInvites > 1 ? 'es' : ''}` 
            : "Selecciona personas para invitar"
          }
        </Button>
      </div>
    </div>
  );
}