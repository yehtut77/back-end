
const bcrypt = require('bcrypt');
const { query } = require('../config/mysql-config'); 

const update_password = async (id, userData) => {
    let password = userData.newPassword;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

  const sql = `UPDATE users SET password=? WHERE user_id= ?`;
  const results = await query(sql, [hash,id]);
  return results;
};


module.exports = { update_password };

