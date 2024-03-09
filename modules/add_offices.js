// In ./modules/update_currency.js

const { query } = require('../config/mysql-config'); // Assuming you have a MySQL setup

const add_offices = async (officeData) => {
  
  const sql = `Insert into offices(office_name)values(?)`;
  const results = await query(sql, [officeData.office_name]);
  return results;
};


module.exports = { add_offices };

