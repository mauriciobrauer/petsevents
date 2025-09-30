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

// GET /api/reviews - Get all reviews
router.get('/', (req, res) => {
  const { eventId, petId } = req.query;
  let query = 'SELECT * FROM reviews';
  let params = [];

  if (eventId) {
    query += ' WHERE event_id = ?';
    params.push(eventId);
  } else if (petId) {
    query += ' WHERE pet_id = ?';
    params.push(petId);
  }

  query += ' ORDER BY created_at DESC';

  req.db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }

    const reviews = rows.map(row => ({
      id: row.id,
      petId: row.pet_id,
      petName: row.pet_name,
      petAvatar: row.pet_avatar,
      rating: row.rating,
      comment: row.comment,
      date: row.date,
      ownerName: row.owner_name,
      eventId: row.event_id,
      createdAt: row.created_at
    }));

    res.json(reviews);
  });
});

// GET /api/reviews/:id - Get single review
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM reviews WHERE id = ?';

  req.db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching review:', err);
      return res.status(500).json({ error: 'Failed to fetch review' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = {
      id: row.id,
      petId: row.pet_id,
      petName: row.pet_name,
      petAvatar: row.pet_avatar,
      rating: row.rating,
      comment: row.comment,
      date: row.date,
      ownerName: row.owner_name,
      eventId: row.event_id,
      createdAt: row.created_at
    };

    res.json(review);
  });
});

// POST /api/reviews - Create new review
router.post('/', (req, res) => {
  const {
    petId,
    petName,
    petAvatar,
    rating,
    comment,
    date,
    ownerName,
    eventId
  } = req.body;

  if (!petId || !petName || !rating || !comment || !date || !ownerName) {
    return res.status(400).json({ 
      error: 'Missing required fields: petId, petName, rating, comment, date, ownerName' 
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ 
      error: 'Rating must be between 1 and 5' 
    });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO reviews (id, pet_id, pet_name, pet_avatar, rating, comment, date, owner_name, event_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  req.db.run(query, [id, petId, petName, petAvatar, rating, comment, date, ownerName, eventId], function(err) {
    if (err) {
      console.error('Error creating review:', err);
      return res.status(500).json({ error: 'Failed to create review' });
    }

    res.status(201).json({ 
      id, 
      message: 'Review created successfully',
      review: {
        id,
        petId,
        petName,
        petAvatar,
        rating,
        comment,
        date,
        ownerName,
        eventId
      }
    });
  });
});

// PUT /api/reviews/:id - Update review
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    petId,
    petName,
    petAvatar,
    rating,
    comment,
    date,
    ownerName,
    eventId
  } = req.body;

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ 
      error: 'Rating must be between 1 and 5' 
    });
  }

  const query = `
    UPDATE reviews 
    SET pet_id = ?, pet_name = ?, pet_avatar = ?, rating = ?, 
        comment = ?, date = ?, owner_name = ?, event_id = ?
    WHERE id = ?
  `;

  req.db.run(query, [petId, petName, petAvatar, rating, comment, date, ownerName, eventId, id], function(err) {
    if (err) {
      console.error('Error updating review:', err);
      return res.status(500).json({ error: 'Failed to update review' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review updated successfully' });
  });
});

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM reviews WHERE id = ?';

  req.db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting review:', err);
      return res.status(500).json({ error: 'Failed to delete review' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  });
});

module.exports = router;
