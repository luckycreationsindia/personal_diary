const express = require('express');
const router = express.Router();
const Controller = require('../controllers/blog');
const middlewares = require('../middlewares');

/* Add New Blog */
router.post('/add', middlewares.adminCheck, Controller.add);

/* Update Blog */
router.post('/update', middlewares.adminCheck, Controller.update);

/* Load All Blogs */
router.get('/', middlewares.adminCheck, Controller.loadAll);

/* Load Blogs */
router.post('/', Controller.load);

module.exports = router;
