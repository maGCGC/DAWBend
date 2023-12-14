require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
require('./passport-setup'); // Configuración de Passport
const mysql = require('mysql2');

const app = express();

// Configuración de la tienda de sesiones con MySQL
const options = {
    host: process.env.DB_HOST,
    port: 3306, // Asegúrate de que este sea el puerto correcto para tu base de datos MySQL
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
const sessionStore = new MySQLStore(options);

// Conexión a la base de datos MySQL
const db = mysql.createConnection(options);
db.connect(error => {
    if (error) throw error;
    console.log("Conexión establecida con la base de datos.");
});
// Activar CORS para todas las solicitudes
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Configuración de la sesión
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false } // Cambia a true si estás usando HTTPS
}));

// Inicializar Passport y habilitar el manejo de sesiones
app.use(passport.initialize());
app.use(passport.session());

const comprasRoutes = require('./routes/compras');
const ventasRoutes = require('./routes/ventas');
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const reportRoutes = require('./routes/report'); 
const gastosRoutes = require('./routes/gastos');


// Usar las rutas
app.use('/api/compras', comprasRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/gastos', gastosRoutes);


// Rutas de autenticación de Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Éxito en la autenticación, redirige a donde necesites.
        res.redirect('/');
    }
);

// Definir el puerto y lanzar el servidor
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server ejecutándose en el puerto ${PORT}`);
    });
}

module.exports = app;
