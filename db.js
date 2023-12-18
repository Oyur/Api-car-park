const mysql = require('mysql2/promise')

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'car-park',
    port: 8889
});



module.exports = conn;