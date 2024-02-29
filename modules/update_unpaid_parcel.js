const { query } = require('../config/mysql-config');

const update_unpaid_parcel = async (data) =>
{
   
  try {
 
        
        const sql = 'Update hs_reg SET payment_checklist=?,payment_method=? where waybill_no=?';
      

      
            await query(sql, [data.paid_check,data.payment_method,data.tracking_num]);
          
      
   
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { update_unpaid_parcel };