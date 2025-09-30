const { initializeDatabase, getDatabase } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const seedUsers = async () => {
  try {
    await initializeDatabase();
    const db = getDatabase();

    console.log('🌱 Seeding users and their pets...');

    // Clear existing data
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM event_pets', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM reviews', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM pets', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM events', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Insert users
    const users = [
      {
        id: 'user1',
        name: 'Luis Torres',
        email: 'luis@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'user2',
        name: 'Sofia Méndez',
        email: 'sofia@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'user3',
        name: 'Roberto Silva',
        email: 'roberto@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    ];

    for (const user of users) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (id, name, email, avatar) VALUES (?, ?, ?, ?)',
          [user.id, user.name, user.email, user.avatar],
          function(err) {
            if (err) reject(err);
            else {
              console.log(`✅ Inserted user: ${user.name}`);
              resolve();
            }
          }
        );
      });
    }

    // Insert pets
    const pets = [
      {
        id: 'pet1',
        name: 'Max',
        type: 'Perro',
        breed: 'Golden Retriever',
        age: 3,
        personality: 'Amigable y enérgico',
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
        avatar: 'https://images.unsplash.com/photo-1675726377625-32b0c0351afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWUlMjBkb2d8ZW58MXx8fHwxNzU5MjQ1MzQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        ownerId: 'user3',
        ownerName: 'Roberto Silva'
      }
    ];

    for (const pet of pets) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO pets (id, name, type, breed, age, personality, avatar, owner_id, owner_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [pet.id, pet.name, pet.type, pet.breed, pet.age, pet.personality, pet.avatar, pet.ownerId, pet.ownerName],
          function(err) {
            if (err) reject(err);
            else {
              console.log(`✅ Inserted pet: ${pet.name} (${pet.ownerName})`);
              resolve();
            }
          }
        );
      });
    }

    // Insert events
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

    for (const event of events) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO events (id, title, date, time, location, is_private, attendees, description, organizer, image, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [event.id, event.title, event.date, event.time, event.location, event.isPrivate, event.attendees, event.description, event.organizer, event.image, event.eventType],
          function(err) {
            if (err) reject(err);
            else {
              console.log(`✅ Inserted event: ${event.title}`);
              resolve();
            }
          }
        );
      });
    }

    // Insert event-pet relationships
    const eventPets = [
      { eventId: '1', petId: 'pet1' },
      { eventId: '1', petId: 'pet3' },
      { eventId: '2', petId: 'pet2' },
      { eventId: '3', petId: 'pet3' },
      { eventId: '4', petId: 'pet1' },
      { eventId: '4', petId: 'pet2' }
    ];

    for (const ep of eventPets) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO event_pets (id, event_id, pet_id) VALUES (?, ?, ?)',
          [uuidv4(), ep.eventId, ep.petId],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    // Insert reviews
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

    for (const review of reviews) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO reviews (id, pet_id, pet_name, pet_avatar, rating, comment, date, owner_name, event_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [review.id, review.petId, review.petName, review.petAvatar, review.rating, review.comment, review.date, review.ownerName, review.eventId],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    console.log('🎉 Database seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedUsers().then(() => {
    console.log('✅ Seeding process finished!');
    process.exit(0);
  }).catch(err => {
    console.error('💥 Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedUsers };
