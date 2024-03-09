// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const {passport, isAuthenticated} = require('./config/passport-config');
const {registration_save} = require('./modules/registration_save');
const { search_tracking_num } = require('./modules/search_tracking')
const { create_user } = require('./modules/create_user')
const { fetch_office } = require('./modules/fetch_offices'); 
const { fetch_currencies } = require('./modules/fetch_currencies'); 
const { fetch_payment } = require('./modules/fetch_payment'); 
const { received } = require('./modules/recevied'); 
const { update_unpaid_parcel } = require('./modules/update_unpaid_parcel'); 
const { query } = require('./config/mysql-config');
const { tracking_status } = require('./modules/tracking_status');
const { report } = require('./modules/report');
const { update_currency } = require('./modules/update_currencies');
const { add_currency } = require('./modules/add_currency');
const { update_payment_method } = require('./modules/update_payment_method');
const { add_payment_method } = require('./modules/add_payment_method');
const { update_offices } = require('./modules/update_offices');
const {  add_offices } = require('./modules/add_offices');
const jwt = require('jsonwebtoken'); 
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const allowedOrigins = [
  'https://hs-cargo-iqh3jnxex-ye-htut-khaungs-projects.vercel.app',
  'https://hs-cargo.vercel.app',
  'http://localhost:3000'
  
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200 
};


const app = express(); 
app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(helmet());

app.use(limiter);

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());


// server.js


app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: info ? info.message : 'Login failed' });
    }

    const payload = {
      sub: user.user_id,
      isAdmin: user.isAdmin 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { 
    
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: 'ok', userId: user.user_id, isAdmin: user.isAdmin });
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
      receiver_township,paid_check,payment_method,total_amt,qty,parcel_desc,deli_method,user_id,receiver_address,weight,parcel_type,currency} = req.body;
     // console.log(req.body);
      const newRegistration = {from_country,pickup_date,received_date,sender_name,sender_phone,receiver_name,receiver_phone,
        receiver_township,paid_check,payment_method,total_amt,qty,parcel_desc,deli_method,user_id,receiver_address,weight,parcel_type,currency};
         registration_code = await registration_save(newRegistration);
       //  console.log("reg code server js"+registration_code);

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
app.get('/currencies',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const currencies = await fetch_currencies();
    res.status(200).json(currencies); // Send offices as the response
  } catch (error) {
    console.error("Error fetching currencies:", error);
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
app.post('/add_payment_method',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const paymentData = req.body; 
    const payments = await add_payment_method(paymentData);
    if (payments.affectedRows > 0) {
      res.status(200).json({ message: "Add New Currency successfully" });
    } else {
      res.status(404).json({ message: "Currency not found" });
    }
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/add_currency',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const currencyData = req.body; 
    const currencies = await add_currency(currencyData);
    if (currencies.affectedRows > 0) {
      res.status(200).json({ message: "Add New Currency successfully" });
    } else {
      res.status(404).json({ message: "Currency not found" });
    }
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/add_office',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const officeData = req.body; 
    const offices = await add_offices(officeData);
    if (offices.affectedRows > 0) {
      res.status(200).json({ message: "Add New Offices successfully" });
    } else {
      res.status(404).json({ message: "Office not found" });
    }
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).send('Internal Server Error');
  }
});
app.put('/update_currencies/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params; // Get the currency ID from the route parameters
  const currencyData = req.body; // Assuming the new currency data is sent in the request body

  try {
    const updateResults = await update_currency(id, currencyData);
    if (updateResults.affectedRows > 0) {
      res.status(200).json({ message: "Currency updated successfully" });
    } else {
      res.status(404).json({ message: "Currency not found" });
    }
  } catch (error) {
    console.error('Error updating currency:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.put('/update_offices/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params; 
  const officeData = req.body;

  try {
    const updateResults = await update_offices(id, officeData);
    if (updateResults.affectedRows > 0) {
      res.status(200).json({ message: "Currency updated successfully" });
    } else {
      res.status(404).json({ message: "Currency not found" });
    }
  } catch (error) {
    console.error('Error updating currency:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.put('/update_payment_method/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params;
  const currencyData = req.body; 

  try {
    const updateResults = await update_payment_method(id, currencyData);
    if (updateResults.affectedRows > 0) {
      res.status(200).json({ message: "Payment Method updated successfully" });
    } else {
      res.status(404).json({ message: "Payment Method not found" });
    }
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.status(200).send("Successfully logged out");
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