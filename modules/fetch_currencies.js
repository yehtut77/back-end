
const { query } = require('../config/mysql-config');

// Perform database operations
 const fetch_currencies = async (cb) =>
{
    
  try {
  

    //  Select all rows from a table
   const currencies = await query('SELECT idcurrencies,curr_prefix,curr_desc FROM currencies');
   // console.log('Countries:', offices);
    return currencies;
    //  Insert a new user into the database
    
    //const result = await query('INSERT INTO hs_reg SET ?', newUser);
    //console.log('New user ID:', result.insertId);
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { fetch_currencies };