const API_BASE_URL = 'http://localhost:3003/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  pets?: Pet[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  personality: string;
  avatar: string;
  ownerId: string;
  ownerName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  petId: string;
  petName: string;
  petAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  ownerName: string;
  eventId?: string;
  createdAt?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  isPrivate: boolean;
  attendees: number;
  description: string;
  organizer: string;
  image?: string;
  eventType?: string;
  attendingPets?: Pet[];
  reviews?: Review[];
  reviewCount?: number;
  avgRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error or server unavailable');
  }
}

// Events API
export const eventsApi = {
  // Get all events
  getAll: (): Promise<Event[]> => {
    return apiRequest<Event[]>('/events');
  },

  // Get single event
  getById: (id: string): Promise<Event> => {
    return apiRequest<Event>(`/events/${id}`);
  },

  // Create new event
  create: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string; message: string; event: Event }> => {
    return apiRequest<{ id: string; message: string; event: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Update event
  update: (id: string, eventData: Partial<Event>): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Delete event
  delete: (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Add pet to event
  addPet: (eventId: string, petId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/events/${eventId}/attend`, {
      method: 'POST',
      body: JSON.stringify({ petId }),
    });
  },

  // Remove pet from event
  removePet: (eventId: string, petId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/events/${eventId}/attend/${petId}`, {
      method: 'DELETE',
    });
  },
};

// Pets API
export const petsApi = {
  // Get all pets
  getAll: (): Promise<Pet[]> => {
    return apiRequest<Pet[]>('/pets');
  },

  // Get single pet
  getById: (id: string): Promise<Pet> => {
    return apiRequest<Pet>(`/pets/${id}`);
  },

  // Create new pet
  create: (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string; message: string; pet: Pet }> => {
    return apiRequest<{ id: string; message: string; pet: Pet }>('/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  },

  // Update pet
  update: (id: string, petData: Partial<Pet>): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    });
  },

  // Delete pet
  delete: (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/pets/${id}`, {
      method: 'DELETE',
    });
  },

  // Get events for a specific pet
  getEvents: (petId: string): Promise<Event[]> => {
    return apiRequest<Event[]>(`/pets/${petId}/events`);
  },
};

// Reviews API
export const reviewsApi = {
  // Get all reviews (with optional filters)
  getAll: (filters?: { eventId?: string; petId?: string }): Promise<Review[]> => {
    const params = new URLSearchParams();
    if (filters?.eventId) params.append('eventId', filters.eventId);
    if (filters?.petId) params.append('petId', filters.petId);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/reviews?${queryString}` : '/reviews';
    
    return apiRequest<Review[]>(endpoint);
  },

  // Get single review
  getById: (id: string): Promise<Review> => {
    return apiRequest<Review>(`/reviews/${id}`);
  },

  // Create new review
  create: (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<{ id: string; message: string; review: Review }> => {
    return apiRequest<{ id: string; message: string; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Update review
  update: (id: string, reviewData: Partial<Review>): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  delete: (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API
export const usersApi = {
  // Get all users
  getAll: (): Promise<User[]> => {
    return apiRequest<User[]>('/users');
  },

  // Get single user
  getById: (id: string): Promise<User> => {
    return apiRequest<User>(`/users/${id}`);
  },

  // Create user
  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'pets'>): Promise<User> => {
    return apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user
  update: (id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'pets'>>): Promise<User> => {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  remove: (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthApi = {
  check: (): Promise<{ status: string; message: string }> => {
    return apiRequest<{ status: string; message: string }>('/health');
  },
};
