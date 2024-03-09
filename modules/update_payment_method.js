// In ./modules/update_currency.js

const { query } = require('../config/mysql-config'); // Assuming you have a MySQL setup

const update_payment_method = async (id, paymentData) => {
  
  const sql = `UPDATE payment_method SET payment_method_name = ? WHERE idpayment_method= ?`;
  const results = await query(sql, [paymentData.payment_method_name,id]);
  return results;
};


module.exports = { update_payment_method };

