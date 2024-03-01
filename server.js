// server.js
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const {passport, isAuthenticated} = require('./config/passport-config');
const {registration_save} = require('./modules/registration_save');
const { search_tracking_num } = require('./modules/search_tracking')
const { create_user } = require('./modules/create_user')
const { fetch_office } = require('./modules/fetch_offices'); 
const { fetch_payment } = require('./modules/fetch_payment'); 
const { received } = require('./modules/recevied'); 
const { update_unpaid_parcel } = require('./modules/update_unpaid_parcel'); 
const { query } = require('./config/mysql-config');
const { tracking_status } = require('./modules/tracking_status');
const { report } = require('./modules/report');
const jwt = require('jsonwebtoken'); // Make sure jsonwebtoken is imported

const corsOptions = {
  origin: 'https://hs-cargo-kxbrm3g0x-ye-htut-khaungs-projects.vercel.app', // Specify the origin you are allowing
  credentials: true, // This is important for cookies, authorization headers with HTTPS
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
// const corsOptions = {
//   origin: 'http://localhost:3000', // Specify the origin you are allowing
//   credentials: true, // This is important for cookies, authorization headers with HTTPS
//   optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };


const app = express(); 
app.use(cors(corsOptions));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
   
}));
app.use(passport.session());

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());


// server.js

// Replace the existing '/login' route with the following
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    // User authenticated, proceed to token generation
    // Note: No need for req.logIn with JWT, as we don't use session cookies
    const payload = {
      sub: user.user_id, // Use user ID as JWT subject
      username: user.username // You can include more user information if needed
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }); // Generate JWT token

    // Respond with JWT token
    return res.status(200).json({
      message: 'ok',
      token: token, // Send the token to the client
      userId: user.user_id // Include the user ID in the response
    });
  })(req, res, next);
});
app.post('/received' ,passport.authenticate('jwt', { session: false }), async(req, res) => {
  const { waybills } = req.body;
  if (waybills.length === 0) {
    return res.status(400).send('No waybills provided.');
  }
  try{
    
      await received(req.body);
     
  

  }catch(err) {
    console.error('Error inserting data:',err);
    res.status(500).send('Internal Server Error');
  }
  res.status(200).send('Successfully Received');
 
})

app.post('/registration' ,passport.authenticate('jwt', { session: false }), async(req, res) => {
  var registration_code = '';
  try{
    const {from_country,pickup_date,received_date,sender_name,sender_phone,receiver_name,receiver_phone,
      receiver_township,paid_check,payment_method,total_amt,qty,parcel_desc,deli_method,user_id,receiver_address,weight} = req.body;
      console.log(req.body);
      const newRegistration = {from_country,pickup_date,received_date,sender_name,sender_phone,receiver_name,receiver_phone,
        receiver_township,paid_check,payment_method,total_amt,qty,parcel_desc,deli_method,user_id,receiver_address,weight};
         registration_code = await registration_save(newRegistration);
         console.log("reg code server js"+registration_code);

  }catch(err) {
    console.error('Error inserting data:',err);
    res.status(500).send('Internal Server Error');
  }
  const data = {
    registration_code
  }
  res.status(200).json(data);
})
app.post('/search_tracking_num', async (req, res) => {
  try {
    const { tracking_num } = req.body;
    const data = await search_tracking_num(tracking_num); // Await the async function
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/report', passport.authenticate('jwt', { session: false }),async (req, res) => {
  try {
    const { from_date,to_date,office } = req.body;
    const newData = {from_date,to_date,office}
    const data = await report(newData); // Await the async function
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/tracking_status', async (req, res) => {
  try {
    const { tracking_num } = req.body;
    const data = await tracking_status(tracking_num); // Await the async function
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/update_unpaid', passport.authenticate('jwt', { session: false }),async (req, res) => {
  try {
    const { tracking_num,paid_check,payment_method } = req.body;
    const update_data = {tracking_num,paid_check,payment_method};
    const data = await update_unpaid_parcel(update_data); // Await the async function
    
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send('Internal Server Error');
  }
  res.status(200).send('Successfully Updated');
});

app.post('/create_user', passport.authenticate('jwt', { session: false }),async (req, res) => {
  try {
    const { username, password, given_name, office } = req.body;
    const newUser = { username, password, given_name, office };
    const data = await create_user(newUser);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);

    if (error.type === 'user-exists') {
      return res.status(409).json({ error: 'Username already exists' });
    } else {
      // Since you're not using 'database-error' type anywhere, you might consider simplifying to a default error response
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

app.get('/offices',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const offices = await fetch_office();
    res.status(200).json(offices); // Send offices as the response
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/', async (req, res) => {
 res.send("it's work");
});
app.get('/payment_method',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const payments = await fetch_payment();
    res.status(200).json(payments); // Send offices as the response
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).send('Internal Server Error');
  }
});
// Logout route
app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    //res.redirect('/');
  });
  
  res.status(200).send("Successfully Logout");
});

app.get('/fetch_countries', passport.authenticate('jwt', { session: false }), async(req, res) => {
  try {
  

    //  Select all rows from a table
   const countries = await query('SELECT name,prefix FROM country');
    console.log('Countries:', countries);
    res.status(200).send({
      status: 'Success',
      data: {
          countries
          
      }
  });
    //  Insert a new user into the database
    
    //const result = await query('INSERT INTO hs_reg SET ?', newUser);
    //console.log('New user ID:', result.insertId);
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
});
app.get('/check_authentication',passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).send('ok');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});