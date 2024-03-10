// In ./modules/update_currency.js

const { query } = require('../config/mysql-config'); // Assuming you have a MySQL setup

const update_users = async (id, userData) => {
  
  const sql = `UPDATE users SET given_name = ?,office =? WHERE user_id= ?`;
  const results = await query(sql, [userData.given_name,userData,id]);
  return results;
};


module.exports = { update_users };

