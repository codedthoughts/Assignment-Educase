const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

// Route fot adding a new school
router.post('/addSchool', schoolController.addSchool);

// Route for Listing all schools sorted by proximity
router.get('/listSchools', schoolController.listSchools);

module.exports = router;