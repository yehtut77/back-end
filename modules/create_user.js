const { query } = require('../config/mysql-config');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Perform database operations
const create_user = async (data) => {
  try {
    // Check if the username already exists
    const existingUserQuery = 'SELECT * FROM users WHERE user_name = ?';
    const existingUser = await query(existingUserQuery, [data.username]);

    if (existingUser.length > 0) {
        let error = new Error('Username already exists');
        error.type = 'user-exists'; // Add this line
        throw error;
      }
    let password = data.password;
    const saltRounds = 10; // the cost of processing the data. Higher is more secure but slower.

    const hash = await bcrypt.hash(password, saltRounds);
    const userId = uuidv4();
    const sql = 'INSERT INTO users (user_id, user_name, password, given_name, office) VALUES (?, ?, ?, ?, ?)';
    const values = [userId, data.username, hash, data.given_name, data.office];
    const result = await query(sql, values);
    console.log(`${userId} inserted successfully`);
    return { message: 'User created successfully' };
  } catch (err) {
    console.error('Error performing database operation:', err);
    throw err; // Propagate the error back to the caller
  }
};

module.exports = { create_user };
