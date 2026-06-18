const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationControllers');

// GET y POST de Reservas
router.get('/', reservationController.getAllReservations);
router.post('/', reservationController.createReservation);

// PUT y DELETE de Reservas
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

// AUXILIAR PARA EL MODAL DE RESERVAS
router.get('/habitaciones', reservationController.getAllRooms);

module.exports = router;