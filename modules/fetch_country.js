
const { query } = require('../config/mysql-config');

// Perform database operations
 const fetch_country_function = async (cb) =>
{
    
  try {
  

    //  Select all rows from a table
   const countries = await query('SELECT name,prefix FROM country');
    console.log('Countries:', countries);
    return cb(res);
    //  Insert a new user into the database
    
    //const result = await query('INSERT INTO hs_reg SET ?', newUser);
    //console.log('New user ID:', result.insertId);
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { fetch_country_function };