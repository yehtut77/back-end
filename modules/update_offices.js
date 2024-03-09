// In ./modules/update_currency.js

const { query } = require('../config/mysql-config'); // Assuming you have a MySQL setup

const update_offices = async (id, officeData) => {
  
  const sql = `UPDATE offices SET office_name = ? WHERE idoffices= ?`;
  const results = await query(sql, [officeData.office_name, id]);
  return results;
};


module.exports = { update_offices };

