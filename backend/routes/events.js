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

// GET /api/events - Get all events
router.get('/', (req, res) => {
  const query = `
    SELECT 
      e.*,
      GROUP_CONCAT(p.id) as pet_ids,
      GROUP_CONCAT(p.name) as pet_names,
      GROUP_CONCAT(p.type) as pet_types,
      GROUP_CONCAT(p.breed) as pet_breeds,
      GROUP_CONCAT(p.age) as pet_ages,
      GROUP_CONCAT(p.personality) as pet_personalities,
      GROUP_CONCAT(p.avatar) as pet_avatars,
      GROUP_CONCAT(p.owner_name) as pet_owners,
      COUNT(DISTINCT r.id) as review_count,
      AVG(r.rating) as avg_rating
    FROM events e
    LEFT JOIN event_pets ep ON e.id = ep.event_id
    LEFT JOIN pets p ON ep.pet_id = p.id
    LEFT JOIN reviews r ON e.id = r.event_id
    GROUP BY e.id
    ORDER BY e.date ASC, e.time ASC
  `;

  req.db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Failed to fetch events' });
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
      attendingPets: row.pet_ids ? row.pet_ids.split(',').map((id, index) => {
        const names = row.pet_names ? row.pet_names.split(',') : [];
        const types = row.pet_types ? row.pet_types.split(',') : [];
        const breeds = row.pet_breeds ? row.pet_breeds.split(',') : [];
        const ages = row.pet_ages ? row.pet_ages.split(',') : [];
        const personalities = row.pet_personalities ? row.pet_personalities.split(',') : [];
        const avatars = row.pet_avatars ? row.pet_avatars.split(',') : [];
        const owners = row.pet_owners ? row.pet_owners.split(',') : [];
        
        return {
          id: id,
          name: names[index] || '',
          type: types[index] || 'Desconocido',
          breed: breeds[index] || '',
          age: parseInt(ages[index]) || 0,
          personality: personalities[index] || '',
          avatar: avatars[index] || '',
          ownerName: owners[index] || ''
        };
      }) : [],
      reviewCount: row.review_count || 0,
      avgRating: row.avg_rating ? Math.round(row.avg_rating * 10) / 10 : 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json(events);
  });
});

// GET /api/events/:id - Get single event
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const eventQuery = `
    SELECT 
      e.*,
      GROUP_CONCAT(p.id) as pet_ids,
      GROUP_CONCAT(p.name) as pet_names,
      GROUP_CONCAT(p.type) as pet_types,
      GROUP_CONCAT(p.breed) as pet_breeds,
      GROUP_CONCAT(p.age) as pet_ages,
      GROUP_CONCAT(p.personality) as pet_personalities,
      GROUP_CONCAT(p.avatar) as pet_avatars,
      GROUP_CONCAT(p.owner_name) as pet_owners,
      COUNT(DISTINCT r.id) as review_count,
      AVG(r.rating) as avg_rating
    FROM events e
    LEFT JOIN event_pets ep ON e.id = ep.event_id
    LEFT JOIN pets p ON ep.pet_id = p.id
    LEFT JOIN reviews r ON e.id = r.event_id
    WHERE e.id = ?
    GROUP BY e.id
  `;

  req.db.get(eventQuery, [id], (err, eventRow) => {
    if (err) {
      console.error('Error fetching event:', err);
      return res.status(500).json({ error: 'Failed to fetch event' });
    }

    if (!eventRow) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get reviews for this event
    const reviewsQuery = `
      SELECT * FROM reviews 
      WHERE event_id = ? 
      ORDER BY created_at DESC
    `;

    req.db.all(reviewsQuery, [id], (err, reviewRows) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        return res.status(500).json({ error: 'Failed to fetch reviews' });
      }

      const event = {
        id: eventRow.id,
        title: eventRow.title,
        date: eventRow.date,
        time: eventRow.time,
        location: eventRow.location,
        isPrivate: Boolean(eventRow.is_private),
        attendees: eventRow.attendees,
        description: eventRow.description,
        organizer: eventRow.organizer,
        image: eventRow.image,
        eventType: eventRow.event_type,
        attendingPets: eventRow.pet_ids ? eventRow.pet_ids.split(',').map((id, index) => {
          const names = eventRow.pet_names ? eventRow.pet_names.split(',') : [];
          const types = eventRow.pet_types ? eventRow.pet_types.split(',') : [];
          const breeds = eventRow.pet_breeds ? eventRow.pet_breeds.split(',') : [];
          const ages = eventRow.pet_ages ? eventRow.pet_ages.split(',') : [];
          const personalities = eventRow.pet_personalities ? eventRow.pet_personalities.split(',') : [];
          const avatars = eventRow.pet_avatars ? eventRow.pet_avatars.split(',') : [];
          const owners = eventRow.pet_owners ? eventRow.pet_owners.split(',') : [];
          
          return {
            id: id,
            name: names[index] || '',
            type: types[index] || 'Desconocido',
            breed: breeds[index] || '',
            age: parseInt(ages[index]) || 0,
            personality: personalities[index] || '',
            avatar: avatars[index] || '',
            ownerName: owners[index] || ''
          };
        }) : [],
        reviews: reviewRows.map(review => ({
          id: review.id,
          petId: review.pet_id,
          petName: review.pet_name,
          petAvatar: review.pet_avatar,
          rating: review.rating,
          comment: review.comment,
          date: review.date,
          ownerName: review.owner_name
        })),
        reviewCount: eventRow.review_count || 0,
        avgRating: eventRow.avg_rating ? Math.round(eventRow.avg_rating * 10) / 10 : 0,
        createdAt: eventRow.created_at,
        updatedAt: eventRow.updated_at
      };

      res.json(event);
    });
  });
});

// POST /api/events - Create new event
router.post('/', (req, res) => {
  const {
    title,
    date,
    time,
    location,
    isPrivate,
    description,
    organizer,
    image,
    eventType
  } = req.body;

  if (!title || !date || !location || !description || !organizer) {
    return res.status(400).json({ 
      error: 'Missing required fields: title, date, location, description, organizer' 
    });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO events (id, title, date, time, location, is_private, description, organizer, image, event_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  req.db.run(query, [id, title, date, time, location, isPrivate ? 1 : 0, description, organizer, image, eventType || 'general'], function(err) {
    if (err) {
      console.error('Error creating event:', err);
      return res.status(500).json({ error: 'Failed to create event' });
    }

    res.status(201).json({ 
      id, 
      message: 'Event created successfully',
      event: {
        id,
        title,
        date,
        time,
        location,
        isPrivate: Boolean(isPrivate),
        attendees: 0,
        description,
        organizer,
        image,
        eventType: eventType || 'general',
        attendingPets: [],
        reviews: [],
        reviewCount: 0,
        avgRating: 0
      }
    });
  });
});

// PUT /api/events/:id - Update event
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    title,
    date,
    time,
    location,
    isPrivate,
    attendees,
    description,
    organizer,
    image,
    eventType
  } = req.body;

  const query = `
    UPDATE events 
    SET title = ?, date = ?, time = ?, location = ?, is_private = ?, 
        attendees = ?, description = ?, organizer = ?, image = ?, 
        event_type = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  req.db.run(query, [title, date, time, location, isPrivate ? 1 : 0, attendees, description, organizer, image, eventType, id], function(err) {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ error: 'Failed to update event' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully' });
  });
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  req.db.serialize(() => {
    // Delete related records first
    req.db.run('DELETE FROM event_pets WHERE event_id = ?', [id]);
    req.db.run('DELETE FROM reviews WHERE event_id = ?', [id]);
    
    // Delete the event
    req.db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting event:', err);
        return res.status(500).json({ error: 'Failed to delete event' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json({ message: 'Event deleted successfully' });
    });
  });
});

// POST /api/events/:id/attend - Add pet to event
router.post('/:id/attend', (req, res) => {
  const { id: eventId } = req.params;
  const { petId } = req.body;

  if (!petId) {
    return res.status(400).json({ error: 'Pet ID is required' });
  }

  const attendId = uuidv4();
  const query = 'INSERT INTO event_pets (id, event_id, pet_id) VALUES (?, ?, ?)';

  req.db.run(query, [attendId, eventId, petId], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Pet is already attending this event' });
      }
      console.error('Error adding pet to event:', err);
      return res.status(500).json({ error: 'Failed to add pet to event' });
    }

    // Update attendees count
    req.db.run('UPDATE events SET attendees = attendees + 1 WHERE id = ?', [eventId]);

    res.json({ message: 'Pet added to event successfully' });
  });
});

// DELETE /api/events/:id/attend/:petId - Remove pet from event
router.delete('/:id/attend/:petId', (req, res) => {
  const { id: eventId, petId } = req.params;

  req.db.run('DELETE FROM event_pets WHERE event_id = ? AND pet_id = ?', [eventId, petId], function(err) {
    if (err) {
      console.error('Error removing pet from event:', err);
      return res.status(500).json({ error: 'Failed to remove pet from event' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pet is not attending this event' });
    }

    // Update attendees count
    req.db.run('UPDATE events SET attendees = attendees - 1 WHERE id = ?', [eventId]);

    res.json({ message: 'Pet removed from event successfully' });
  });
});

module.exports = router;
