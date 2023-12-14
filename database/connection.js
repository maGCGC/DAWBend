// En backend/database/connection.js

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Autofactura2023$',
  database: 'autofactura'
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;
