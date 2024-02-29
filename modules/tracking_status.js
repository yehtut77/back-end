const { search_tracking_num } = require('./search_tracking');
const moment = require('moment');

// Perform database operations
const tracking_status = async (tracking_num) => {
    try {
        const result = await search_tracking_num(tracking_num);
        if (!result || result.length === 0) {
            console.error('No data found for tracking number:', tracking_num);
            return null; // or appropriate response indicating no data found
        }

        const pickupDatetime = moment(result[0].pickup_date);
        //console.log(pickupDatetime);
        const currentDatetime = moment.tz("Asia/Bangkok");
        const hoursDiff = currentDatetime.diff(pickupDatetime, 'hours');
        const is24Hours = hoursDiff >= 24;
       // console.log('Has it been 24 hours or more?', is24Hours);

        let statusArr = [];
        if (result[0].received === 0 && is24Hours) {
            statusArr = [
                `Transit Warehouse`,
                `Pickup at ${result[0].office}` // Assuming office is correct
            ];
        } else if (result[0].received === 1) {
            statusArr = [
                `Arrive at ${result[0].receivedByOffice}`, // Assuming received_by_office is correct
                `Transit Warehouse`,
                `Pickup at ${result[0].office}` // Assuming office is correct
            ];
        } else {
            statusArr = [
                `Pickup at ${result[0].office}` // Assuming office is correct
            ];
        }

        return statusArr; // Make sure to return the status array or appropriate response
    } catch (err) {
        console.error('Error performing database operation:', err);
        throw err;
    }
};

module.exports = { tracking_status };
