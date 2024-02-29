// passport-config.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { query } = require('./mysql-config'); // Import your MySQL configuration

passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  async (username, password, done) => {
    try {
      // Fetch user from database based on username
      const sql = 'SELECT * FROM users WHERE user_name = ?';
      const result = await query(sql, [username]);
      const user = result[0]; // Assuming username is unique and there's only one result
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      // Compare hashed password from database with provided password
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Fetch user from database based on user ID
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    const result = await query(sql, [id]);
    const user = result[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, continue to next middleware
  }
  res.status(400).json("Not Authorised");
  // User is not authenticated, respond with an error
};

module.exports = { passport, isAuthenticated };
