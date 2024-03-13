
const { query } = require('../config/mysql-config');
const moment = require('moment-timezone');

// Perform database operations
const search_tracking_num = async (tracking_num) => {
    try {
      const sql = 'SELECT u.office,reg.curr_prefix_unpaid,reg.received_by,reg.pickup_date, reg.sender_name, reg.sender_phone, reg.rcvr_name, reg.rcvr_phone, reg.rcvr_township,reg.rcvr_address,reg.payment_checklist, reg.payment_method, reg.total_amt, reg.qty,' 
      +'reg.local_del_method,reg.parcel_desc,reg.received,reg.weight,receiverUser.office AS receivedByOffice  FROM hs_reg as reg Inner Join users as u On reg.user_id = u.user_id LEFT JOIN hs_cargo.users AS receiverUser ON reg.received_by = receiverUser.user_id WHERE reg.waybill_no = ?'

      const data = await query(sql, [tracking_num]); // Make sure to await the query
      const dataWithLocalTime = data.map(record => {
        if (record.pickup_date) {
            // Assuming your local timezone is 'Asia/Yangon'
            const localTime = moment(record.pickup_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
            return { ...record, pickup_date: localTime };
        }
        return record;
    });

   // console.log(dataWithLocalTime);
    return dataWithLocalTime;
    } catch (err) {
      console.error('Error performing database operation:', err);
      throw err; // Ensure errors are thrown or handled to be caught in the route
    }
  };
  
module.exports = { search_tracking_num }; 