const express = require('express');
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const router = express.Router();

router.use(bodyParser.json())

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

//ล็อกอิน
router.post(`/login`, async (req, res, next) => {
    if(!conn){
        await connectMySQL();
    }
    
    //console.log(conn)
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        try{
            let response = await conn.query(`SELECT username, password, position FROM users WHERE username = '${username}' and password = '${password}'`);
            let results = response[0];
    
            if(username === results[0].username && password === results[0].password){
                res.header('Content-Type', 'application/json');
                res.status(200).json(results[0]);
            }
        }catch(error){
            res.status(403).json({ message: 'login failed' });
        }
    }
});

//ดึงข้อมูล users ทั้งหมด
router.get(`/users`, async (req, res) => {
    if(!conn){
        await connectMySQL();
    }
    let response = await conn.query(`SELECT * FROM users`);
    let results = response[0];

    if(results.length > 0){
        res.json(results);
    }else{
        res.json({ message: 'No data' });
    }
});

//เพิ่ม users
router.post(`/users`, async (req, res) => {
    if(!conn){
        await connectMySQL();
    }
    const data = req.body;
    let response = await conn.query(`INSERT INTO users SET ?`, data);
    const userId = response[0].insertId;
    res.status(201).json({ message: 'User created successfully', userId });
})

//แก้ไขข้อมูล users
router.put(`/users/:id`, async (req, res) => {
    if(!conn){
        await connectMySQL();
    }
    const data = req.body;
    const userId = parseInt(req.params.id);

    let response = await conn.query(`UPDATE users SET ? WHERE id = ?`, [data, userId]);
    if (response[0].affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: 'User updated successfully', userId: userId })
});

//ลบข้อมูล users
router.delete(`/users/:id`, async (req, res) => {
    if(!conn){
        await connectMySQL();
    }
    const userId = parseInt(req.params.id);

    let response = await conn.query(`DELETE FROM users WHERE id = ${userId}`);
    res.json({ message: 'Delete user successful', userId: userId });
});

module.exports = router;