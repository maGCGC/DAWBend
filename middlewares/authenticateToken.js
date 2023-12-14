const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log('authenticateToken llamado');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // No token, return unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token no válido
    }
    req.user = user;
    next(); // Token válido, procede a la siguiente middleware o ruta
  });
};

module.exports = authenticateToken;
