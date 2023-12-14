// En backend/controllers/userController.js
const bcrypt = require('bcrypt');
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
        const { nombre_usuario, email, contraseña } = req.body;
        const rol = "user"; // Rol predeterminado para nuevos usuarios
    
        bcrypt.hash(contraseña, saltRounds, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Error al hashear la contraseña' });
            }
    
            const query = 'INSERT INTO Usuarios (nombre_usuario, email, contraseña, rol) VALUES (?, ?, ?, ?)';
            db.query(query, [nombre_usuario, email, hashedPassword, rol], (error, results) => {
                if (error) {
                    return res.status(500).json({ error });
                }
                res.status(201).send(`Usuario registrado con ID: ${results.insertId}`);
            });
        });
    },
    loginUser: (req, res) => {
        const { email, contraseña } = req.body;

        const query = 'SELECT * FROM Usuarios WHERE email = ?';
        db.query(query, [email], (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Error en la base de datos" });
            }

            if (results.length > 0) {
                const usuario = results[0];

                bcrypt.compare(contraseña, usuario.contraseña, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json({ error: "Error al verificar la contraseña" });
                    }

                    if (isMatch) {
                        res.json({
                            id: usuario.id,
                            nombre_usuario: usuario.nombre_usuario,
                            email: usuario.email,
                            rol: usuario.rol // Incluir el rol en la respuesta
                        });
                    } else {
                        res.status(401).send("Contraseña incorrecta");
                    }
                });
            } else {
                res.status(404).send("Usuario no encontrado");
            }
        });
    },   
};

module.exports = userController;
