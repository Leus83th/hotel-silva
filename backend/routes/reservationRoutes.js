const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationControllers');

router.post('/reservas', reservationController.createReservation);
router.get('/reservas', reservationController.getAllReservations);
router.post('/habitaciones', reservationController.createRoom);
router.get('/habitaciones', reservationController.getAllRooms);

module.exports = router;