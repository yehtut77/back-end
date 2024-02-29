
const { query } = require('../config/mysql-config');

// Perform database operations
 const fetch_payment = async (cb) =>
{
    
  try {
  

    //  Select all rows from a table
   const payments = await query('SELECT payment_method_name FROM payment_method');
   // console.log('Countries:', payments);
    return payments;
    //  Insert a new user into the database
    
    //const result = await query('INSERT INTO hs_reg SET ?', newUser);
    //console.log('New user ID:', result.insertId);
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { fetch_payment };