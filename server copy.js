require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const passportSetup = require('./passport-setup');
const passport = require('passport');

const sessionStore = new MySQLStore(options);

// Importar rutas
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const invoiceRoutes = require('./routes/invoices');

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);

app.use(passport.initialize()); // Inicializar Passport
app.use(passport.session());
app.use(session({
  secret: 'tu_secreto', // Usa una clave secreta segura
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false } // Cambia a true si estás usando HTTPS
}));

// Rutas de autenticación de Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Éxito en la autenticación, redirige a donde necesites.
    res.redirect('/');
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ejecutnadose en el puerto ${PORT}`);
});

const mysql = require('mysql2');


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(error => {
  if (error) throw error;
  console.log("Conexión establecida con la base de datos.");
});