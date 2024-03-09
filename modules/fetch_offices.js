
const { query } = require('../config/mysql-config');

// Perform database operations
 const fetch_office = async (cb) =>
{
    
  try {
  

    //  Select all rows from a table
   const offices = await query('SELECT idoffices,office_name FROM offices');
   // console.log('Countries:', offices);
    return offices;
    //  Insert a new user into the database
    
    //const result = await query('INSERT INTO hs_reg SET ?', newUser);
    //console.log('New user ID:', result.insertId);
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { fetch_office };