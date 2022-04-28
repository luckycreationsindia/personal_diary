const express = require('express');
const router = express.Router();
const Controller = require('../controllers/banner');
const middlewares = require('../middlewares');

/* Add New Banner */
router.post('/add', middlewares.adminCheck, Controller.add);

/* Update Banner */
router.post('/update', middlewares.adminCheck, Controller.update);

/* Load All Banners */
router.get('/', middlewares.adminCheck, Controller.loadAll);

/* Load Banners */
router.post('/', Controller.load);

module.exports = router;
