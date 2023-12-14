const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database/connection'); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
    scope: ['profile', 'email'] // Añadir el scope aquí
  },
  (accessToken, refreshToken, profile, done) => {
    // Aquí debes implementar la lógica para buscar o crear un usuario
    const email = profile.emails[0].value; // El email del usuario de Google

    // Buscar al usuario en tu base de datos
    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    db.query(query, [email], (error, results) => {
        if (error) {
            return done(error);
        }
        
        if (results.length > 0) {
            // El usuario ya existe
            return done(null, results[0]);
        } else {
            // Crear un nuevo usuario
            const newUser = {
                email: email,
                nombre_usuario: profile.displayName,
                // Otros campos necesarios...
            };

            const insertQuery = 'INSERT INTO Usuarios SET ?';
            db.query(insertQuery, newUser, (error, results) => {
                if (error) {
                    return done(error);
                }
                newUser.id = results.insertId;
                return done(null, newUser);
            });
        }
    });
}
));

// Serialización y deserialización de usuarios (necesario si usas sesiones)
passport.serializeUser((user, done) => {
  done(null, user.id); // Guardar el ID del usuario en la sesión
});

passport.deserializeUser((id, done) => {
  // Buscar usuario por ID en la base de datos
  const query = 'SELECT * FROM Usuarios WHERE id = ?';
  db.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al deserializar el usuario:', error);
          return done(error);
      }

      if (results.length > 0) {
          done(null, results[0]); // El usuario encontrado se pasa al request
      } else {
          done(new Error('Usuario no encontrado')); // Manejo de usuario no encontrado
      }
  });
});


module.exports = passport;
