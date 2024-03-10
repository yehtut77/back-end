const { query } = require('../config/mysql-config');
const moment = require('moment-timezone');

// Perform database operations
const report_all = async (data) => {
    try {
        const sql = "SELECT reg.curr_prefix_unpaid,reg.rcvr_name,reg.rcvr_phone,reg.rcvr_township,reg.payment_checklist,reg.payment_method,reg.total_amt,reg.weight,reg.qty,reg.waybill_no,reg.pickup_date,reg.user_id,u.given_name,u.office FROM hs_cargo.hs_reg as reg Inner Join users as u on reg.user_id = u.user_id where reg.pickup_date BETWEEN ? AND ? ORDER BY reg.pickup_date ASC, reg.waybill_no ASC, reg.payment_checklist ASC";
        const value = [data.from_date, data.to_date];
        const result = await query(sql, value);
       // console.log(data.from_date);
        //console.log(data.to_date)
      //  console.log(data.office);
        // Initialize aggregations
        let totalQty = 0;
        let countUnpaid = 0;
        let countPaid = 0;
        let totalWeight = 0;
        let totalAmountByPaymentMethod = {}; // This will now only include paid transactions
        let unpaidAmountByCurrency = {}; // Separate tracking for unpaid amounts by currency

        result.forEach(item => {
            totalQty += item.qty;
            totalWeight += item.weight || 0;

            if (item.payment_checklist === 0) { // Unpaid transaction
                countUnpaid++;
                // Aggregating unpaid amounts by currency
                const currency = item.curr_prefix_unpaid || 'Unknown'; // Handling items without a specified currency
                if (!unpaidAmountByCurrency[currency]) {
                    unpaidAmountByCurrency[currency] = 0;
                }
                unpaidAmountByCurrency[currency] += item.total_amt;
            } else { // Paid transaction
                countPaid++;
                // Only paid transactions are aggregated here
                const paymentMethod = item.payment_method;
                if (paymentMethod) { // Check if payment method is not empty
                    if (!totalAmountByPaymentMethod[paymentMethod]) {
                        totalAmountByPaymentMethod[paymentMethod] = 0;
                    }
                    totalAmountByPaymentMethod[paymentMethod] += item.total_amt;
                }
            }
        });

        return {
            data: result,
            totalQty,
            countUnpaid,
            countPaid,
            totalWeight,
            totalAmountByPaymentMethod,
            unpaidAmountByCurrency
        };
    } catch (err) {
        console.error('Error performing database operation:', err);
        throw err; // Ensure errors are thrown or handled to be caught in the route
    }
};

module.exports = { report_all };
