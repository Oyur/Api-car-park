const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const mysql = require('mysql2/promise')
//const conn = require('./db');

router.use(bodyParser.json());

let conn;
const connectMySQL = async () => {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'car-park',
      port: 8889
    })
}

router.get(`/location`, async (req, res) => {
    if(!conn){
        await connectMySQL();
    }

    let response = await conn.query(`SELECT * FROM location JOIN users ON location.userId = users.id;`)

    res.json(response[0]);
})

router.get(`/location/:id`, async (req, res) => {
    if(!conn){
        await connectMySQL();
    }
    const id = req.params.id;
    let response = await conn.query(`SELECT * FROM location WHERE id = ?`,id);
    res.json(response[0]);
})

router.put(`/location/:id`, async (req, res) => {
    if(!conn){
        await connectMySQL();
    }
    const data = req.body;
    const id = req.params.id;
    const location = req.body.location;

    let response = await conn.query(`UPDATE location SET ? WHERE id = ?`, [data, id]);
    res.json({ message: 'success', location: location });
})

module.exports = router;