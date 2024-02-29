// database.js

const mysql = require('mysql');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'hs-cargo.mysql.database.azure.com', // Change this to your MySQL host
  user: 'yehtut77', // Change this to your MySQL user
  password: 'Casp77254178301546', // Change this to your MySQL password
  database: 'hs_cargo' // Change this to your MySQL database
});

// Perform a database query
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
};

module.exports = { query };