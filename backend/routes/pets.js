const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/db');

const router = express.Router();

// Middleware to ensure database is available
const ensureDatabase = (req, res, next) => {
  try {
    req.db = getDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database not initialized' });
  }
};

// Apply database middleware to all routes
router.use(ensureDatabase);

// GET /api/pets - Get all pets
router.get('/', (req, res) => {
  const query = 'SELECT * FROM pets ORDER BY created_at DESC';

  req.db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching pets:', err);
      return res.status(500).json({ error: 'Failed to fetch pets' });
    }

    const pets = rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      breed: row.breed,
      age: row.age,
      personality: row.personality,
      isCastrated: Boolean(row.is_castrated),
      socialMediaUrl: row.social_media_url,
      eventsAttended: row.events_attended,
      vaccinationsUpToDate: Boolean(row.vaccinations_up_to_date),
      avatar: row.avatar,
      ownerId: row.owner_id,
      ownerName: row.owner_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json(pets);
  });
});

// GET /api/pets/:id - Get single pet
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM pets WHERE id = ?';

  req.db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching pet:', err);
      return res.status(500).json({ error: 'Failed to fetch pet' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const pet = {
      id: row.id,
      name: row.name,
      type: row.type,
      breed: row.breed,
      age: row.age,
      personality: row.personality,
      isCastrated: Boolean(row.is_castrated),
      socialMediaUrl: row.social_media_url,
      eventsAttended: row.events_attended,
      vaccinationsUpToDate: Boolean(row.vaccinations_up_to_date),
      avatar: row.avatar,
      ownerId: row.owner_id,
      ownerName: row.owner_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    res.json(pet);
  });
});

// POST /api/pets - Create new pet
router.post('/', (req, res) => {
  const {
    name,
    type,
    breed,
    age,
    personality,
    isCastrated,
    socialMediaUrl,
    eventsAttended,
    vaccinationsUpToDate,
    avatar,
    ownerId,
    ownerName
  } = req.body;

  if (!name || !type || !breed || !age || !personality || !ownerId || !ownerName) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, type, breed, age, personality, ownerId, ownerName' 
    });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO pets (id, name, type, breed, age, personality, is_castrated, social_media_url, events_attended, vaccinations_up_to_date, avatar, owner_id, owner_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  req.db.run(query, [
    id, name, type, breed, age, personality, 
    isCastrated ? 1 : 0, socialMediaUrl || null, eventsAttended || 0, 
    vaccinationsUpToDate ? 1 : 0, avatar, ownerId, ownerName
  ], function(err) {
    if (err) {
      console.error('Error creating pet:', err);
      return res.status(500).json({ error: 'Failed to create pet' });
    }

    res.status(201).json({ 
      id, 
      message: 'Pet created successfully',
      pet: {
        id,
        name,
        type,
        breed,
        age,
        personality,
        isCastrated,
        socialMediaUrl,
        eventsAttended,
        vaccinationsUpToDate,
        avatar,
        ownerId,
        ownerName
      }
    });
  });
});

// PUT /api/pets/:id - Update pet
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    breed,
    age,
    personality,
    isCastrated,
    socialMediaUrl,
    eventsAttended,
    vaccinationsUpToDate,
    avatar,
    ownerId,
    ownerName
  } = req.body;

  const query = `
    UPDATE pets 
    SET name = ?, type = ?, breed = ?, age = ?, personality = ?, 
        is_castrated = ?, social_media_url = ?, events_attended = ?, vaccinations_up_to_date = ?, 
        avatar = ?, owner_id = ?, owner_name = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  req.db.run(query, [
    name, type, breed, age, personality, 
    isCastrated ? 1 : 0, socialMediaUrl || null, eventsAttended || 0, 
    vaccinationsUpToDate ? 1 : 0, avatar, ownerId, ownerName, id
  ], function(err) {
    if (err) {
      console.error('Error updating pet:', err);
      return res.status(500).json({ error: 'Failed to update pet' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.json({ message: 'Pet updated successfully' });
  });
});

// DELETE /api/pets/:id - Delete pet
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  req.db.serialize(() => {
    // Delete related records first
    req.db.run('DELETE FROM event_pets WHERE pet_id = ?', [id]);
    req.db.run('DELETE FROM reviews WHERE pet_id = ?', [id]);
    
    // Delete the pet
    req.db.run('DELETE FROM pets WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting pet:', err);
        return res.status(500).json({ error: 'Failed to delete pet' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pet not found' });
      }

      res.json({ message: 'Pet deleted successfully' });
    });
  });
});

// GET /api/pets/:id/events - Get events for a specific pet
router.get('/:id/events', (req, res) => {
  const { id: petId } = req.params;

  const query = `
    SELECT 
      e.*,
      COUNT(DISTINCT r.id) as review_count,
      AVG(r.rating) as avg_rating
    FROM events e
    INNER JOIN event_pets ep ON e.id = ep.event_id
    LEFT JOIN reviews r ON e.id = r.event_id
    WHERE ep.pet_id = ?
    GROUP BY e.id
    ORDER BY e.date ASC, e.time ASC
  `;

  req.db.all(query, [petId], (err, rows) => {
    if (err) {
      console.error('Error fetching pet events:', err);
      return res.status(500).json({ error: 'Failed to fetch pet events' });
    }

    const events = rows.map(row => ({
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      location: row.location,
      isPrivate: Boolean(row.is_private),
      attendees: row.attendees,
      description: row.description,
      organizer: row.organizer,
      image: row.image,
      eventType: row.event_type,
      reviewCount: row.review_count || 0,
      avgRating: row.avg_rating ? Math.round(row.avg_rating * 10) / 10 : 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json(events);
  });
});

module.exports = router;
