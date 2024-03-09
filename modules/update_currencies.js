// In ./modules/update_currency.js

const { query } = require('../config/mysql-config'); // Assuming you have a MySQL setup

const update_currency = async (id, currencyData) => {
  
  const sql = `UPDATE currencies SET curr_desc = ?, curr_prefix = ? WHERE idcurrencies= ?`;
  const results = await query(sql, [currencyData.curr_desc, currencyData.curr_prefix, id]);
  return results;
};


module.exports = { update_currency };

