const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// All routes here are protected and require admin role
router.use(auth);
router.use(isAdmin);

// User management
router.get('/users', adminController.getAllUsers);

// Application management
router.get('/applications', adminController.getAllApplications);
router.put('/applications/:id', adminController.updateApplicationStatus);

// Scheme management
router.post('/schemes', adminController.createScheme);
router.put('/schemes/:id', adminController.updateScheme);
router.delete('/schemes/:id', adminController.deleteScheme);

// Stats
router.get('/stats', adminController.getStats);

module.exports = router;
