const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(cors());
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'wathare'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.get('/sensor_data', (req, res) => {
    console.log("*****")
    connection.query('SELECT * FROM sensor_data', (err, results) => {
        if (err) {
            console.error('Error querying database: ', err);
            res.status(500).send('Error querying database');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
