const express = require('express');
const app = express();
const port = 9999;
const location = require('./location');
const users = require('./users');
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors());

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

app.post('/api', (req, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.status(200).json({ message: 'ok'});
});


app.use('/api', location);
app.use('/api', users);