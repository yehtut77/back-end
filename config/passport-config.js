// passport-config.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { query } = require('./mysql-config'); // Import your MySQL configuration
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'username'
}, async (username, password, done) => {
  try {
   // console.log(`Authenticating user: ${username}`);
    const sql = 'SELECT * FROM users WHERE user_name = ?';
    const users = await query(sql, [username]);

    if (users.length === 0) {
     // console.log('No user found with that username.');
      return done(null, false, { message: 'Incorrect username.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
     // console.log('Password does not match.');
      return done(null, false, { message: 'Incorrect password.' });
    }

   // console.log('User authenticated successfully.');
    return done(null, user);
  } catch (error) {
    console.error('Error during authentication:', error);
    return done(error);
  }
}));


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
      (req) => req.cookies['token'] 
  ]),
  secretOrKey: process.env.JWT_SECRET,
};


// JWT strategy
passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    const result = await query(sql, [jwt_payload.sub]); 
    const user = result[0];

    if (user) {
      return done(null, user); // User found
    } else {
      return done(null, false); // User not found
    }
  } catch (error) {
    return done(error, false);
  }
}));
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
  res.status(401).json("Not Authorised");
  // User is not authenticated, respond with an error
};

module.exports = { passport, isAuthenticated };
