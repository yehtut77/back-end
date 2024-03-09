// In ./modules/update_currency.js

const { query } = require('../config/mysql-config'); // Assuming you have a MySQL setup

const add_currency = async (currencyData) => {
  
  const sql = `Insert into currencies(curr_prefix,curr_desc)values(?,?)`;
  const results = await query(sql, [currencyData.curr_prefix,currencyData.curr_desc]);
  return results;
};


module.exports = { add_currency };

