const { initializeDatabase, getDatabase } = require('../database/db');

const seedData = async () => {
  try {
    await initializeDatabase();
    const db = getDatabase();

    console.log('🌱 Starting database seeding...');

    // Clear existing data
    db.serialize(() => {
      db.run('DELETE FROM reviews');
      db.run('DELETE FROM event_pets');
      db.run('DELETE FROM events');
      db.run('DELETE FROM pets');

      // Insert pets
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
          owner_id: 'u1',
          owner_name: 'Luis Torres'
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
          owner_id: 'u2',
          owner_name: 'Sofia Méndez'
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
          owner_id: 'u3',
          owner_name: 'Roberto Silva'
        }
      ];

      const insertPet = db.prepare(`
        INSERT INTO pets (id, name, type, breed, age, personality, is_castrated, social_media_url, events_attended, vaccinations_up_to_date, avatar, owner_id, owner_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      pets.forEach(pet => {
        insertPet.run([
          pet.id, pet.name, pet.type, pet.breed, pet.age, 
          pet.personality, pet.isCastrated ? 1 : 0, pet.socialMediaUrl, 
          pet.eventsAttended, pet.vaccinationsUpToDate ? 1 : 0, 
          pet.avatar, pet.owner_id, pet.owner_name
        ]);
      });

      insertPet.finalize();

      // Insert events
      const events = [
        {
          id: '1',
          title: 'Paseo grupal en el parque',
          date: '2024-10-15',
          time: '09:00',
          location: 'Parque Central',
          is_private: 0,
          attendees: 12,
          description: 'Un paseo relajante con nuestras mascotas en el parque más grande de la ciudad.',
          organizer: 'María González',
          image: 'https://images.unsplash.com/photo-1596653048850-7918adea48b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nJTIwcGFya3xlbnwxfHx8fDE3NTkyMDc1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          event_type: 'paseo'
        },
        {
          id: '2',
          title: 'Concurso de disfraces caninos',
          date: '2024-10-20',
          time: '15:00',
          location: 'Plaza de las Mascotas',
          is_private: 0,
          attendees: 25,
          description: '¡Ven con tu perro disfrazado y compite por increíbles premios!',
          organizer: 'Carlos Ruiz',
          image: 'https://images.unsplash.com/photo-1549366970-b62f33797001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjb3N0dW1lJTIwY29udGVzdCUyMHBhcnR5fGVufDF8fHx8MTc1OTI0NDgxNnww&ixlib=rb-4.1.0&q=80&w=1080',
          event_type: 'concurso'
        },
        {
          id: '3',
          title: 'Taller de adiestramiento',
          date: '2024-10-18',
          time: '16:00',
          location: 'Centro Canino Elite',
          is_private: 1,
          attendees: 8,
          description: 'Sesión privada de entrenamiento básico para cachorros.',
          organizer: 'Ana Veterinaria',
          image: 'https://images.unsplash.com/photo-1752834368595-87001d44ed9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRzJTIwdHJhaW5pbmclMjBjbGFzc3xlbnwxfHx8fDE3NTkyNDQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
          event_type: 'entrenamiento'
        },
        {
          id: '4',
          title: 'Adopción responsable',
          date: '2024-10-22',
          time: '10:00',
          location: 'Refugio Los Amigos',
          is_private: 0,
          attendees: 35,
          description: 'Evento para conocer mascotas en busca de hogar y promover la adopción.',
          organizer: 'Fundación Refugio',
          image: 'https://images.unsplash.com/photo-1749024362878-d0dbe102594d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBhZG9wdGlvbiUyMHNoZWx0ZXJ8ZW58MXx8fHwxNzU5MjQ0ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          event_type: 'adopcion'
        }
      ];

      const insertEvent = db.prepare(`
        INSERT INTO events (id, title, date, time, location, is_private, attendees, description, organizer, image, event_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      events.forEach(event => {
        insertEvent.run([
          event.id, event.title, event.date, event.time, event.location,
          event.is_private, event.attendees, event.description, event.organizer,
          event.image, event.event_type
        ]);
      });

      insertEvent.finalize();

      // Insert event-pet relationships
      const eventPets = [
        { id: 'ep1', event_id: '1', pet_id: 'pet1' },
        { id: 'ep2', event_id: '1', pet_id: 'pet3' },
        { id: 'ep3', event_id: '2', pet_id: 'pet2' },
        { id: 'ep4', event_id: '3', pet_id: 'pet3' },
        { id: 'ep5', event_id: '4', pet_id: 'pet1' },
        { id: 'ep6', event_id: '4', pet_id: 'pet2' }
      ];

      const insertEventPet = db.prepare(`
        INSERT INTO event_pets (id, event_id, pet_id)
        VALUES (?, ?, ?)
      `);

      eventPets.forEach(ep => {
        insertEventPet.run([ep.id, ep.event_id, ep.pet_id]);
      });

      insertEventPet.finalize();

      // Insert reviews
      const reviews = [
        {
          id: 'r1',
          pet_id: 'pet1',
          pet_name: 'Max',
          pet_avatar: 'https://images.unsplash.com/photo-1608416947274-51c1ea89eeda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkxMzMwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 5,
          comment: '¡Guau guau! Me encantó correr y jugar con todos mis amigos. El parque tenía muchos olores interesantes.',
          date: '2024-09-20',
          owner_name: 'Luis Torres',
          event_id: '1'
        },
        {
          id: 'r2',
          pet_id: 'pet2',
          pet_name: 'Luna',
          pet_avatar: 'https://images.unsplash.com/photo-1710997740246-75b30937dd6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MTQ3MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 5,
          comment: 'Miau miau, mi disfraz de princesa fue el mejor. Los humanos tomaron muchas fotos.',
          date: '2024-09-15',
          owner_name: 'Sofia Méndez',
          event_id: '2'
        },
        {
          id: 'r3',
          pet_id: 'pet3',
          pet_name: 'Rocky',
          pet_avatar: 'https://images.unsplash.com/photo-1675726377625-32b0c0351afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWUlMjBkb2d8ZW58MXx8fHwxNzU5MjQ1MzQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 4,
          comment: 'Woof! Aprendí muchos trucos nuevos. La entrenadora olía a premios, eso me gustó.',
          date: '2024-09-10',
          owner_name: 'Roberto Silva',
          event_id: '3'
        },
        {
          id: 'r4',
          pet_id: 'pet1',
          pet_name: 'Max',
          pet_avatar: 'https://images.unsplash.com/photo-1608416947274-51c1ea89eeda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkxMzMwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
          rating: 5,
          comment: '¡Qué emocionante ayudar a encontrar familias para otros amigos! Conocí muchos olores nuevos.',
          date: '2024-09-25',
          owner_name: 'Luis Torres',
          event_id: '4'
        }
      ];

      const insertReview = db.prepare(`
        INSERT INTO reviews (id, pet_id, pet_name, pet_avatar, rating, comment, date, owner_name, event_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      reviews.forEach(review => {
        insertReview.run([
          review.id, review.pet_id, review.pet_name, review.pet_avatar,
          review.rating, review.comment, review.date, review.owner_name, review.event_id
        ]);
      });

      insertReview.finalize();

      console.log('✅ Database seeded successfully!');
      console.log(`📊 Created ${pets.length} pets, ${events.length} events, and ${reviews.length} reviews`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
