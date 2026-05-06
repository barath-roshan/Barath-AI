const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { auth } = require('../middleware/auth');

router.post('/', auth, applicationController.submitApplication);
router.get('/my', auth, applicationController.getMyApplications);
router.get('/track/:applicationNumber', applicationController.trackApplication);

module.exports = router;
