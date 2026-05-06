const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');

router.get('/', schemeController.getSchemes);
router.get('/category/:category', schemeController.getSchemesByCategory);
router.get('/seed', schemeController.seedSchemes);

module.exports = router;
