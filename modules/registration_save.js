
const { query } = require('../config/mysql-config');
const { generate_tracking_no} = require('../modules/generate_tracking');

// Perform database operations
 const registration_save = async (registration_data) =>
{
   
  try {
    var user = registration_data.user_id;
    var from_country = registration_data.from_country;
    var waybill_no = "";
   var pickup_date = registration_data.pickup_date;
   //var received_date = registration_data.received_date;
   var sender_name = registration_data.sender_name;
   var sender_phone = registration_data.sender_phone;
   var receiver_name = registration_data.receiver_name;
   var receiver_phone = registration_data.receiver_phone;
   var receiver_township = registration_data.receiver_township;
   var receiver_address = registration_data.receiver_address;
   var paid_check = registration_data.paid_check;
   var payment_method = registration_data.payment_method;
   var total_amt = registration_data.total_amt;
   var qty = registration_data.qty;
   var parcel_desc = registration_data.parcel_desc;
   var deli_method = registration_data.deli_method;
   var weight = registration_data.weight;

   // Parse the date string to a Date object
const pickupDate = new Date(pickup_date);

// Get the current time
const now = new Date();

// Set the time of pickupDate to the current time
pickupDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

     
    
    waybill_no = await generate_tracking_no(from_country);
       // console.log("Here is registration Data"+registration_data.sender_name);
    const current_date = new Date();
    const formattedDate = current_date.toISOString().slice(0,19).replace('T',' ');
        const sql = 
        "Insert into hs_reg(waybill_no,pickup_date,sender_name,sender_phone,rcvr_name,rcvr_phone,rcvr_township,payment_checklist,payment_method,total_amt,qty,parcel_desc,local_del_method,create_date,user_id,rcvr_address,weight)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values = [waybill_no,pickupDate,sender_name,sender_phone,receiver_name,receiver_phone,receiver_township,paid_check,payment_method,total_amt,qty,parcel_desc,deli_method,formattedDate,user,receiver_address,weight];
     await query(sql,values);

     return waybill_no;
   
    

    
    //  Select all rows from a table
   // const users = await query('SELECT * FROM users');
   // console.log('Users:', users);
    
    //  Insert a new user into the database
    
    //const result = await query('INSERT INTO hs_reg SET ?', newUser);
    //console.log('New user ID:', result.insertId);
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { registration_save };