// En backend/middlewares/roleCheck.js

const roleCheck = (requiredRole) => {
    return (req, res, next) => {
        // Asumiendo que el usuario está almacenado en req.user
        if (req.user && req.user.rol === requiredRole) {
            next(); // El usuario tiene el rol requerido, continuar con la ruta
        } else {
            res.status(403).json({ error: 'Acceso denegado' }); // Acceso prohibido si no tiene el rol
        }
    };
};

module.exports = roleCheck;
