const db = require('../config/db');

exports.login = (req, res) => {
    const { usuario, contrasena } = req.body;
    const sql = "SELECT * FROM administradores WHERE usuario = ? AND contrasena = ?";
    
    db.query(sql, [usuario, contrasena], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error en el servidor" });
        }
        if (result.length > 0) {
            res.json({ loginExitoso: true, mensaje: "¡Bienvenido al sistema!" });
        } else {
            res.json({ loginExitoso: false, mensaje: "Usuario o contraseña incorrectos" });
        }
    });
};