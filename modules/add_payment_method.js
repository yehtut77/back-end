// In ./modules/update_currency.js

const { query } = require('../config/mysql-config'); // Assuming you have a MySQL setup

const add_payment_method = async (paymentData) => {
  
  const sql = `Insert into payment_method(payment_method_name)values(?)`;
  const results = await query(sql, [paymentData.payment_method_name]);
  return results;
};


module.exports = { add_payment_method };

