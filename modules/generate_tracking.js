
const { query } = require('../config/mysql-config');

// Perform database operations
 const generate_tracking_no = async (t) =>
{ 
  const company_name = "HS";
  const prefix = company_name+t;
  
  const currentDate = new Date();
const fullYear = currentDate.getFullYear();
const lastTwoDigitsOfYear = String(fullYear).slice(-2);
// Output: "24" (for the year 2024)
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

//console.log(month); // Output: Formatted month ('01' for January, '02' for February, etc.)
    var tracking_no = '';
  try {
  
    console.log(prefix);
    //  Select all rows from a table
    var last_number = '000000';
    var sql = 'SELECT last_number FROM key_notes where prefix = ?';
   
   const data = await query(sql,prefix);
   //console.log("Registration Number "+ data[0].last_number);


   
   if(data.length == 0){
    var sql = 'Insert into key_notes(prefix,last_number,type)values(?,?,?)';
    var values = [prefix,last_number,'waybill'];
    const data = await query(sql,values);
    last_number = (parseInt(last_number)+1).toString().padStart(6,'0');
    last_number = (last_number+1).slice(-6);
    tracking_no = prefix+lastTwoDigitsOfYear+month+last_number;


   }else{
    last_number = (parseInt(data[0].last_number)+1).toString().padStart(6,'0');
    tracking_no = prefix+lastTwoDigitsOfYear+month+last_number;
    var sql = 'Update key_notes Set last_number = ? where prefix=? AND type=?';
    var values = [last_number,prefix,'waybill'];
    await query(sql,values);
   }
  

   
    console.log('Tracking No:', tracking_no);
    return tracking_no;
    
    //  Insert a new user into the database
    
   
  } catch (err) {
    console.error('Error performing database operation:', err);
  }
};
module.exports = { generate_tracking_no };