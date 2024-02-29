const { query } = require('../config/mysql-config');

const received = async (data) =>
{
   
  try {
 
        const current_date = new Date();
        const formattedDate = current_date.toISOString().slice(0,19).replace('T',' ');
        const sql = 'Update hs_reg SET received=?,received_date=?,received_by=? where waybill_no = ?';
      

        for (const code of data.waybills) {
            await query(sql, ['1', formattedDate, data.user_id, code]);
          }
      
   
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { received };