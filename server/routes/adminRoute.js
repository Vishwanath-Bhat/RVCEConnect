const express = require('express');
const { adminLogin, approveOrReject, pendingRequests } = require('../controllers/adminController');
const AlumniModel = require('../models/alumniModel');
const Pending = require('../models/pendingModel');

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);

router.post('/approveReject', approveOrReject);

router.get('/pendingRequests', pendingRequests);

module.exports = router;
