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

// GET /api/users - Get all users
router.get('/', (req, res) => {
  const query = `
    SELECT 
      u.id, u.name, u.email, u.password_hash, u.about_me, u.pets, 
      u.notification_preferences, u.interface_language, u.avatar,
      u.created_at, u.updated_at,
      p.id as pet_id,
      p.name as pet_name,
      p.type as pet_type,
      p.breed as pet_breed,
      p.age as pet_age,
      p.personality as pet_personality,
      p.avatar as pet_avatar
    FROM users u
    LEFT JOIN pets p ON u.id = p.owner_id
    ORDER BY u.name ASC
  `;

  req.db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Group pets by user
    const usersMap = {};
    rows.forEach(row => {
      if (!usersMap[row.id]) {
        usersMap[row.id] = {
          id: row.id,
          name: row.name,
          email: row.email,
          passwordHash: row.password_hash,
          aboutMe: row.about_me,
          pets: row.pets,
          notificationPreferences: row.notification_preferences,
          interfaceLanguage: row.interface_language,
          avatar: row.avatar,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          pets: []
        };
      }
      
      if (row.pet_id) {
        usersMap[row.id].pets.push({
          id: row.pet_id,
          name: row.pet_name,
          type: row.pet_type,
          breed: row.pet_breed,
          age: row.pet_age,
          personality: row.pet_personality,
          avatar: row.pet_avatar
        });
      }
    });

    const users = Object.values(usersMap);
    res.json(users);
  });
});

// GET /api/users/:id - Get single user
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const userQuery = `
    SELECT 
      u.id, u.name, u.email, u.password_hash, u.about_me, u.pets, 
      u.notification_preferences, u.interface_language, u.avatar,
      u.created_at, u.updated_at,
      p.id as pet_id,
      p.name as pet_name,
      p.type as pet_type,
      p.breed as pet_breed,
      p.age as pet_age,
      p.personality as pet_personality,
      p.avatar as pet_avatar
    FROM users u
    LEFT JOIN pets p ON u.id = p.owner_id
    WHERE u.id = ?
  `;

  req.db.all(userQuery, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      passwordHash: rows[0].password_hash,
      aboutMe: rows[0].about_me,
      pets: rows[0].pets,
      notificationPreferences: rows[0].notification_preferences,
      interfaceLanguage: rows[0].interface_language,
      avatar: rows[0].avatar,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
      pets: []
    };

    rows.forEach(row => {
      if (row.pet_id) {
        user.pets.push({
          id: row.pet_id,
          name: row.pet_name,
          type: row.pet_type,
          breed: row.pet_breed,
          age: row.pet_age,
          personality: row.pet_personality,
          avatar: row.pet_avatar
        });
      }
    });

    res.json(user);
  });
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  const { 
    name, 
    email, 
    passwordHash, 
    aboutMe, 
    pets, 
    notificationPreferences, 
    interfaceLanguage, 
    avatar 
  } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO users (id, name, email, password_hash, about_me, pets, notification_preferences, interface_language, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  req.db.run(query, [
    id, 
    name, 
    email, 
    passwordHash || null, 
    aboutMe || null, 
    pets || null, 
    notificationPreferences || null, 
    interfaceLanguage || 'es', 
    avatar || null
  ], function(err) {
    if (err) {
      console.error('Error creating user:', err);
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Failed to create user' });
    }

    res.status(201).json({
      id,
      name,
      email,
      passwordHash,
      aboutMe,
      pets,
      notificationPreferences,
      interfaceLanguage,
      avatar,
      message: 'User created successfully'
    });
  });
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    email, 
    passwordHash, 
    aboutMe, 
    pets, 
    notificationPreferences, 
    interfaceLanguage, 
    avatar 
  } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const query = `
    UPDATE users 
    SET name = ?, email = ?, password_hash = ?, about_me = ?, pets = ?, 
        notification_preferences = ?, interface_language = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  req.db.run(query, [
    name, 
    email, 
    passwordHash || null, 
    aboutMe || null, 
    pets || null, 
    notificationPreferences || null, 
    interfaceLanguage || 'es', 
    avatar || null, 
    id
  ], function(err) {
    if (err) {
      console.error('Error updating user:', err);
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Failed to update user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id,
      name,
      email,
      passwordHash,
      aboutMe,
      pets,
      notificationPreferences,
      interfaceLanguage,
      avatar,
      message: 'User updated successfully'
    });
  });
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM users WHERE id = ?';
  
  req.db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
