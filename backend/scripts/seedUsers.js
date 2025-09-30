const { initializeDatabase, getDatabase } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const seedUsers = async () => {
  try {
    await initializeDatabase();
    const db = getDatabase();

    console.log('🌱 Seeding users and their pets...');

    // Clear existing data
    db.serialize(() => {
      db.run('DELETE FROM event_pets', (err) => {
        if (err) console.error('Error deleting event_pets:', err);
      });
      db.run('DELETE FROM reviews', (err) => {
        if (err) console.error('Error deleting reviews:', err);
      });
      db.run('DELETE FROM pets', (err) => {
        if (err) console.error('Error deleting pets:', err);
      });
      db.run('DELETE FROM users', (err) => {
        if (err) console.error('Error deleting users:', err);
      });
      db.run('DELETE FROM events', (err) => {
        if (err) console.error('Error deleting events:', err);
      });

      // Create users
      const users = [
        {
          id: 'user1',
          name: 'Luis Torres',
          email: 'luis@example.com',
          passwordHash: '$2b$10$rQZ8K9vF3nG2mH5jK7lP8eR2sT6uV9wX1yA4bC7dE0fG3hI6jL9mN2oP5qR8s',
          aboutMe: 'Amante de los perros y organizador de eventos caninos. Siempre dispuesto a ayudar a otras mascotas a socializar.',
          pets: 'Max (Golden Retriever, 3 años)',
          notificationPreferences: '{"email": true, "push": true, "sms": false}',
          interfaceLanguage: 'es',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 'user2',
          name: 'Sofia Méndez',
          email: 'sofia@example.com',
          passwordHash: '$2b$10$rQZ8K9vF3nG2mH5jK7lP8eR2sT6uV9wX1yA4bC7dE0fG3hI6jL9mN2oP5qR8s',
          aboutMe: 'Veterinaria especializada en gatos. Me encanta organizar eventos para que las mascotas se diviertan y socialicen.',
          pets: 'Luna (Siamés, 2 años)',
          notificationPreferences: '{"email": true, "push": false, "sms": true}',
          interfaceLanguage: 'es',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 'user3',
          name: 'Roberto Silva',
          email: 'roberto@example.com',
          passwordHash: '$2b$10$rQZ8K9vF3nG2mH5jK7lP8eR2sT6uV9wX1yA4bC7dE0fG3hI6jL9mN2oP5qR8s',
          aboutMe: 'Entrenador de perros con más de 10 años de experiencia. Organizo talleres de adiestramiento y eventos deportivos caninos.',
          pets: 'Rocky (Border Collie, 5 años)',
          notificationPreferences: '{"email": false, "push": true, "sms": false}',
          interfaceLanguage: 'en',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      ];

      // Insert users
      const insertUser = db.prepare(`
        INSERT INTO users (id, name, email, password_hash, about_me, pets, notification_preferences, interface_language, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      users.forEach(user => {
        insertUser.run(
          user.id, 
          user.name, 
          user.email, 
          user.passwordHash,
          user.aboutMe,
          user.pets,
          user.notificationPreferences,
          user.interfaceLanguage,
          user.avatar
        );
        console.log(`Inserted user: ${user.name}`);
      });

      insertUser.finalize();

      // Create pets for each user
      const pets = [
        {
          id: 'pet1',
          name: 'Max',
          type: 'Perro',
          breed: 'Golden Retriever',
          age: 3,
          personality: 'Amigable y enérgico',
          isCastrated: true,
          socialMediaUrl: 'https://instagram.com/max_golden_retriever',
          eventsAttended: 8,
          vaccinationsUpToDate: true,
          avatar: 'https://images.unsplash.com/photo-1608416947274-51c1ea89eeda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkxMzMwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
          ownerId: 'user1',
          ownerName: 'Luis Torres'
        },
        {
          id: 'pet2',
          name: 'Luna',
          type: 'Gato',
          breed: 'Siamés',
          age: 2,
          personality: 'Curiosa y juguetona',
          isCastrated: true,
          socialMediaUrl: 'https://instagram.com/luna_siamese_cat',
          eventsAttended: 5,
          vaccinationsUpToDate: true,
          avatar: 'https://images.unsplash.com/photo-1710997740246-75b30937dd6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MTQ3MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          ownerId: 'user2',
          ownerName: 'Sofia Méndez'
        },
        {
          id: 'pet3',
          name: 'Rocky',
          type: 'Perro',
          breed: 'Border Collie',
          age: 5,
          personality: 'Inteligente y leal',
          isCastrated: false,
          socialMediaUrl: 'https://instagram.com/rocky_border_collie',
          eventsAttended: 12,
          vaccinationsUpToDate: false,
          avatar: 'https://images.unsplash.com/photo-1675726377625-32b0c0351afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWUlMjBkb2d8ZW58MXx8fHwxNzU5MjQ1MzQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          ownerId: 'user3',
          ownerName: 'Roberto Silva'
        }
      ];

      // Insert pets
      const insertPet = db.prepare(`
        INSERT INTO pets (id, name, type, breed, age, personality, is_castrated, social_media_url, events_attended, vaccinations_up_to_date, avatar, owner_id, owner_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      pets.forEach(pet => {
        insertPet.run(
          pet.id, pet.name, pet.type, pet.breed, pet.age, 
          pet.personality, pet.isCastrated ? 1 : 0, pet.socialMediaUrl, 
          pet.eventsAttended, pet.vaccinationsUpToDate ? 1 : 0, 
          pet.avatar, pet.ownerId, pet.ownerName
        );
      });

      insertPet.finalize();

      // Create events
      const events = [
        {
          id: '1',
          title: 'Paseo grupal en el parque',
          date: '2024-10-15',
          time: '09:00',
          location: 'Parque Central',
          isPrivate: 0,
          attendees: 12,
          description: 'Un paseo relajante con nuestras mascotas en el parque más grande de la ciudad.',
          organizer: 'María González',
          image: 'https://images.unsplash.com/photo-1596653048850-7918adea48b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nJTIwcGFya3xlbnwxfHx8fDE3NTkyMDc1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          eventType: 'paseo'
        },
        {
          id: '2',
          title: 'Concurso de disfraces caninos',
          date: '2024-10-20',
          time: '15:00',
          location: 'Plaza de las Mascotas',
          isPrivate: 0,
          attendees: 25,
          description: '¡Ven con tu perro disfrazado y compite por increíbles premios!',
          organizer: 'Carlos Ruiz',
          image: 'https://images.unsplash.com/photo-1549366970-b62f33797001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjb3N0dW1lJTIwY29udGVzdCUyMHBhcnR5fGVufDF8fHx8MTc1OTI0NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080',
          eventType: 'concurso'
        },
        {
          id: '3',
          title: 'Taller de adiestramiento',
          date: '2024-10-18',
          time: '16:00',
          location: 'Centro Canino Elite',
          isPrivate: 1,
          attendees: 8,
          description: 'Sesión privada de entrenamiento básico para cachorros.',
          organizer: 'Ana Veterinaria',
          image: 'https://images.unsplash.com/photo-1752834368595-87001d44ed9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRzJTIwdHJhaW5pbmclMjBjbGFzc3xlbnwxfHx8fDE3NTkyNDQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
          eventType: 'entrenamiento'
        },
        {
          id: '4',
          title: 'Adopción responsable',
          date: '2024-10-22',
          time: '10:00',
          location: 'Refugio Los Amigos',
          isPrivate: 0,
          attendees: 35,
          description: 'Evento para conocer mascotas en busca de hogar y promover la adopción.',
          organizer: 'Fundación Refugio',
          image: 'https://images.unsplash.com/photo-1749024362878-d0dbe102594d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBhZG9wdGlvbiUyMHNoZWx0ZXJ8ZW58MXx8fHwxNzU5MjQ0ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          eventType: 'adopcion'
        }
      ];

      // Insert events
      const insertEvent = db.prepare(`
        INSERT INTO events (id, title, date, time, location, is_private, attendees, description, organizer, image, event_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      events.forEach(event => {
        insertEvent.run(
          event.id, event.title, event.date, event.time, event.location,
          event.isPrivate, event.attendees, event.description, event.organizer,
          event.image, event.eventType
        );
      });

      insertEvent.finalize();

      // Create event-pet relationships
      const eventPets = [
        { eventId: '1', petId: 'pet1' },
        { eventId: '1', petId: 'pet3' },
        { eventId: '2', petId: 'pet2' },
        { eventId: '3', petId: 'pet3' },
        { eventId: '4', petId: 'pet1' },
        { eventId: '4', petId: 'pet2' }
      ];

      const insertEventPet = db.prepare(`
        INSERT INTO event_pets (id, event_id, pet_id)
        VALUES (?, ?, ?)
      `);

      eventPets.forEach(ep => {
        insertEventPet.run(uuidv4(), ep.eventId, ep.petId);
      });

      insertEventPet.finalize();

      // Create reviews
      const reviews = [
        {
          id: 'r1',
          petId: 'pet1',
          petName: 'Max',
          petAvatar: 'https://images.unsplash.com/photo-1608416947274-51c1ea89eeda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkxMzMwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 5,
          comment: '¡Guau guau! Me encantó correr y jugar con todos mis amigos. El parque tenía muchos olores interesantes.',
          date: '2024-09-20',
          ownerName: 'Luis Torres',
          eventId: '1'
        },
        {
          id: 'r2',
          petId: 'pet2',
          petName: 'Luna',
          petAvatar: 'https://images.unsplash.com/photo-1710997740246-75b30937dd6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MTQ3MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 5,
          comment: '¡Miau! Me encantó mi disfraz de princesa. Todos me dijeron que era la más linda.',
          date: '2024-09-21',
          ownerName: 'Sofia Méndez',
          eventId: '2'
        },
        {
          id: 'r3',
          petId: 'pet3',
          petName: 'Rocky',
          petAvatar: 'https://images.unsplash.com/photo-1675726377625-32b0c0351afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWUlMjBkb2d8ZW58MXx8fHwxNzU5MjQ1MzQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 4,
          comment: '¡Guau! Aprendí muchos trucos nuevos. El entrenador era muy paciente conmigo.',
          date: '2024-09-19',
          ownerName: 'Roberto Silva',
          eventId: '3'
        },
        {
          id: 'r4',
          petId: 'pet1',
          petName: 'Max',
          petAvatar: 'https://images.unsplash.com/photo-1608416947274-51c1ea89eeda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkxMzMwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 5,
          comment: '¡Guau guau! Ayudé a muchos perritos a encontrar una familia. Fue muy emocionante.',
          date: '2024-09-23',
          ownerName: 'Luis Torres',
          eventId: '4'
        }
      ];

      const insertReview = db.prepare(`
        INSERT INTO reviews (id, pet_id, pet_name, pet_avatar, rating, comment, date, owner_name, event_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      reviews.forEach(review => {
        insertReview.run(
          review.id, review.petId, review.petName, review.petAvatar,
          review.rating, review.comment, review.date, review.ownerName, review.eventId
        );
      });

      insertReview.finalize();

      console.log('✅ Users seeded successfully');
      console.log('✅ Pets seeded successfully');
      console.log('✅ Events seeded successfully');
      console.log('✅ Reviews seeded successfully');
      console.log('✅ Event-pet relationships seeded successfully');
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedUsers().then(() => {
    console.log('🎉 Database seeding completed!');
    process.exit(0);
  }).catch(err => {
    console.error('💥 Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedUsers };
