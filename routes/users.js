const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleCheck = require('../middlewares/roleCheck');
const authenticateToken = require('../middlewares/authenticateToken');
const { body, validationResult } = require('express-validator');

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);
router.get('/validate-token', userController.validateToken);
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.post('/', authenticateToken, [
    body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').notEmpty().withMessage('El rol es obligatorio')
], userController.createUser);

// Actualizar un usuario
router.put('/:id', authenticateToken, [
    body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').notEmpty().withMessage('El rol es obligatorio')
], userController.updateUser);

// Eliminar un usuario
router.delete('/:id', authenticateToken, roleCheck('admin'), userController.deleteUser);
router.post('/register', [
    body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.registerUser);

module.exports = router;
