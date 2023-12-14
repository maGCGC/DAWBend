// En backend/controllers/clientController.js
const db = require("../database/connection");

const clientController = {
  getAllClients: (req, res) => {
    if (!req.user || !req.user.id) {
      console.error(
        "Error: Usuario no autenticado intentó acceder a getAllClients"
      );
      return res.status(401).json({ error: "Autenticación requerida" });
    }

    const userId = req.user.id;
    const query = "SELECT * FROM Clientes WHERE usuario_id = ?";
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error al obtener clientes:", error);
        return res.status(500).json({ error });
      }
      console.log("Clientes obtenidos:", results);
      res.status(200).json(results);
    });
  },
  getClientById: (req, res) => {
    const query = "SELECT * FROM Clientes WHERE id = ?";
    db.query(query, [req.params.id], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send("Cliente no encontrado");
      }
    });
  },
  createClient: (req, res) => {
    console.log("Creando cliente con datos:", req.body);
    const { nombre, direccion, email, telefono, CIF, usuario_id } = req.body;
    const query =
      "INSERT INTO Clientes (nombre, direccion, email, telefono, usuario_id) VALUES (?, ?, ?, ?, ?)";
      db.query(
        "SELECT COUNT(*) AS count FROM Clientes WHERE CIF = ? AND usuario_id = ?",
        [CIF, usuario_id],
        (error, results) => {
          if (error) {
            return res.status(500).json({ error });
          }
    
          if (results[0].count > 0) {
            // Si el CIF ya está en uso, envía un mensaje de error
            return res.status(400).json({ error: "El CIF ya está registrado para otro cliente." });
          }
    
          // Si el CIF no está en uso, procede a insertar el nuevo cliente
          const insertQuery =
            "INSERT INTO Clientes (nombre, direccion, email, telefono, CIF, usuario_id) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(
            insertQuery,
            [nombre, direccion, email, telefono, CIF, usuario_id],
            (error, results) => {
              if (error) {
                return res.status(500).json({ error });
              }
              const newClientId = results.insertId;
              db.query("SELECT * FROM Clientes WHERE id = ?", [newClientId], (error, results) => {
                if (error) {
                  return res.status(500).json({ error });
                }
                res.status(201).json(results[0]);
              });
            }
          );
        }
      );
    },
    updateClient: (req, res) => {
        console.log("Actualizando cliente con ID:", req.params.id, "y datos:", req.body);
        const { nombre, direccion, email, telefono, CIF, usuario_id } = req.body;
      
        // Verifica primero si el CIF ha cambiado y si está en uso por otro cliente del mismo usuario
        db.query(
          "SELECT CIF FROM Clientes WHERE id = ? AND usuario_id = ?",
          [req.params.id, usuario_id],
          (error, results) => {
            if (error) {
              return res.status(500).json({ error });
            }
            const clienteActual = results[0];
            if (!clienteActual) {
              return res.status(404).json({ error: "Cliente no encontrado" });
            }
            if (clienteActual.CIF !== CIF) {
              db.query(
                "SELECT COUNT(*) AS count FROM Clientes WHERE CIF = ? AND usuario_id = ? AND id != ?",
                [CIF, usuario_id, req.params.id],
                (error, results) => {
                  if (error) {
                    return res.status(500).json({ error });
                  }
                  if (results[0].count > 0) {
                    return res.status(400).json({ error: "El CIF ya está registrado para otro cliente." });
                  } else {
                    // Si el CIF no está en uso, procede a actualizar el cliente
                    const updateQuery =
                      "UPDATE Clientes SET nombre = ?, direccion = ?, email = ?, telefono = ?, CIF = ? WHERE id = ? AND usuario_id = ?";
                    db.query(
                      updateQuery,
                      [nombre, direccion, email, telefono, CIF, req.params.id, usuario_id],
                      (error, results) => {
                        if (error) {
                          return res.status(500).json({ error });
                        }
                        if (results.affectedRows === 0) {
                          return res.status(404).json({ error: "Cliente no encontrado o usuario no autorizado para actualizar este cliente." });
                        }
                        // Si la actualización fue exitosa, obtener el cliente actualizado y enviarlo de vuelta
                        db.query("SELECT * FROM Clientes WHERE id = ?", [req.params.id], (error, results) => {
                          if (error) {
                            return res.status(500).json({ error });
                          }
                          res.status(200).json(results[0]);
                        });
                      }
                    );
                  }
                }
              );
            } else {
              // Si el CIF no ha cambiado, actualiza los otros datos
              const updateQuery =
                "UPDATE Clientes SET nombre = ?, direccion = ?, email = ?, telefono = ? WHERE id = ? AND usuario_id = ?";
              db.query(
                updateQuery,
                [nombre, direccion, email, telefono, req.params.id, usuario_id],
                (error, results) => {
                  if (error) {
                    return res.status(500).json({ error });
                  }
                  if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "Cliente no encontrado o usuario no autorizado para actualizar este cliente." });
                  }
                  // Si la actualización fue exitosa, obtener el cliente actualizado y enviarlo de vuelta
                  db.query("SELECT * FROM Clientes WHERE id = ?", [req.params.id], (error, results) => {
                    if (error) {
                      return res.status(500).json({ error });
                    }
                    res.status(200).json(results[0]);
                  });
                }
              );
            }
          }
        );
      },
  deleteClient: (req, res) => {
    const query = "DELETE FROM Clientes WHERE id = ?";
    db.query(query, [req.params.id], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.affectedRows > 0) {
        res.status(200).send(`Cliente eliminado con ID: ${req.params.id}`);
      } else {
        res.status(404).send("Cliente no encontrado");
      }
    });
  },
};

module.exports = clientController;
