
const { query } = require('../config/mysql-config');

// Perform database operations
 const fetch_users = async (cb) =>
{
    
  try {
  

    //  Select all rows from a table
   const users = await query('SELECT user_id,user_name,given_name,office FROM users Order by office ASC,given_name ASC');
   // console.log('Countries:', offices);
    return users;
    //  Insert a new user into the database
    
    //const result = await query('INSERT INTO hs_reg SET ?', newUser);
    //console.log('New user ID:', result.insertId);
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { fetch_users };