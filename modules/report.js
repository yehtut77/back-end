const { query } = require('../config/mysql-config');
const moment = require('moment-timezone');

// Perform database operations
const report = async (data) => {
    try {
        const sql = "SELECT reg.rcvr_name,reg.rcvr_phone,reg.rcvr_township,reg.payment_checklist,reg.payment_method,reg.total_amt,reg.weight,reg.qty,reg.waybill_no,reg.pickup_date,reg.user_id,u.given_name,u.office FROM hs_cargo.hs_reg as reg Inner Join users as u on reg.user_id = u.user_id where reg.pickup_date BETWEEN ? AND ?  AND u.office = ? Order By reg.pickup_date ASC";
        const value = [data.from_date, data.to_date, data.office];
        const result = await query(sql, value);
        console.log(data.from_date);
        console.log(data.to_date)
        console.log(data.office);
        // Initialize aggregations
        let totalQty = 0;
        let countUnpaid = 0;
        let countPaid = 0;
        let totalWeight = 0;
        let totalAmountByPaymentMethod = {};

        // Aggregate data
        result.forEach(item => {
            totalQty += item.qty; // Sum quantity
            if (item.payment_checklist === 0) countUnpaid++; // Count unpaid
            else countPaid++; // Count paid
            totalWeight += item.weight || 0; // Sum weight, assume null weights as 0

            // Aggregate total amount by payment method
            const paymentMethod = item.payment_method || 'Unpaid Amount'; // Handle null or undefined payment_method
            if (!totalAmountByPaymentMethod[paymentMethod]) {
                totalAmountByPaymentMethod[paymentMethod] = 0;
            }
            totalAmountByPaymentMethod[paymentMethod] += item.total_amt;
        });

        // Return aggregated data along with the original result
        return {
            data: result, // Original data
            totalQty,
            countUnpaid,
            countPaid,
            totalWeight,
            totalAmountByPaymentMethod // Total amount by payment method
        };
    } catch (err) {
        console.error('Error performing database operation:', err);
        throw err; // Ensure errors are thrown or handled to be caught in the route
    }
};

module.exports = { report };
