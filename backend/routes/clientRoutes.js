const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientControllers');

// NOTA: Como en server.js usamos '/api/clientes', aquí solo dejamos '/' o '/:id'

// POST: http://localhost:3001/api/clientes
router.post('/', clientController.createClient);

// GET: http://localhost:3001/api/clientes
router.get('/', clientController.getAllClients);

// PUT: http://localhost:3001/api/clientes/:id
router.put('/:id', clientController.updateClient);

// DELETE: http://localhost:3001/api/clientes/:id
router.delete('/:id', clientController.deleteClient);

module.exports = router;