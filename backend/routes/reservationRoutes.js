const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationControllers');

// ==========================================
// 1. RUTAS ESPECÍFICAS DE HABITACIONES (Siempre arriba)
// ==========================================
router.get('/habitaciones', reservationController.getAllRooms);
router.post('/habitaciones', reservationController.createRoom); // <-- ¡ESTA LÍNEA HACÍA FALTA!
router.put('/habitaciones/:id', reservationController.updateRoom);
router.delete('/habitaciones/:id', reservationController.deleteRoom);

// ==========================================
// 2. RUTAS DE RESERVAS
// ==========================================
router.get('/', reservationController.getAllReservations);
router.post('/', reservationController.createReservation);

// Rutas con parámetros dinámicos (Siempre al final)
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;