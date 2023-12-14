// En backend/controllers/userController.js
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const db = require('../database/connection');


const userController = {
    getAllUsers: (req, res) => {
        const query = 'SELECT * FROM Usuarios';
        db.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.status(200).json(results);
        });
    },
    getUserById: (req, res) => {
        const query = 'SELECT * FROM Usuarios WHERE id = ?';
        db.query(query, [req.params.id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        });
    },
    createUser: (req, res) => {
        const { nombre_usuario, email, contraseña, rol } = req.body;
        const query = 'INSERT INTO Usuarios (nombre_usuario, email, contraseña, rol) VALUES (?, ?, ?, ?)';
        db.query(query, [nombre_usuario, email, contraseña, rol], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.status(201).send(`Usuario creado con ID: ${results.insertId}`);
        });
    },
    updateUser: (req, res) => {
        const { nombre_usuario, email, contraseña, rol } = req.body;
        const query = 'UPDATE Usuarios SET nombre_usuario = ?, email = ?, contraseña = ?, rol = ? WHERE id = ?';
        db.query(query, [nombre_usuario, email, contraseña, rol, req.params.id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (results.affectedRows > 0) {
                res.status(200).send(`Usuario actualizado con ID: ${req.params.id}`);
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        });
    },
    deleteUser: (req, res) => {
        const query = 'DELETE FROM Usuarios WHERE id = ?';
        db.query(query, [req.params.id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (results.affectedRows > 0) {
                res.status(200).send(`Usuario eliminado con ID: ${req.params.id}`);
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        });
    },
    registerUser: (req, res) => {
        const { nombre_usuario, email, password } = req.body; // Cambia 'contraseña' por 'password'
        const rol = "user";
        console.log('Datos recibidos para el registro:', req.body);
        // Verificar unicidad del email
        db.query('SELECT * FROM Usuarios WHERE email = ?', [email], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
    
            // Procesar registro si el email no está en uso
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al hashear la contraseña' });
                }
                const query = 'INSERT INTO Usuarios (nombre_usuario, email, password, rol) VALUES (?, ?, ?, ?)';
                db.query(query, [nombre_usuario, email, hashedPassword, rol], (error, results) => {
                    if (error) {
                        return res.status(500).json({ error });
                    }
                    res.status(201).send(`Usuario registrado con ID: ${results.insertId}`);
                });
            });
        });
    },
    loginUser: (req, res) => {
        const { email, password } = req.body; // Cambio aquí
    
        console.log('Datos de inicio de sesión recibidos:', { email, password });
    
        const query = 'SELECT * FROM Usuarios WHERE email = ?';
        db.query(query, [email], (error, results) => {
            if (error) {
                console.error('Error en la consulta a la base de datos:', error);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
    
            if (results.length > 0) {
                const usuario = results[0];
    
                console.log('Usuario encontrado:', usuario);
    
                bcrypt.compare(password, usuario.password, (err, isMatch) => { // Cambio aquí
                    if (err) {
                        console.error('Error al comparar la contraseña:', err);
                        return res.status(500).json({ error: "Error al verificar la contraseña" });
                    }
    
                    console.log('¿Contraseña coincide?:', isMatch);
    
                    if (isMatch) {
                        // Generar y enviar token aquí
                        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        res.json({
                            token,
                            id: usuario.id,
                            nombre_usuario: usuario.nombre_usuario,
                            email: usuario.email,
                            rol: usuario.rol
                        });
                    } else {
                        res.status(401).send("Contraseña incorrecta");
                    }
                });
            } else {
                console.log('Usuario no encontrado para el email:', email);
                res.status(404).send("Usuario no encontrado");
            }
        });
    },
    validateToken: (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log("Validando token:", token);

        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Token no válido' });
            }
            console.log("Token válido:", decoded);
            res.status(200).json({ valid: true, id: decoded.id, rol: decoded.rol });
        });
    }
    
    

    
   
};

module.exports = userController;
