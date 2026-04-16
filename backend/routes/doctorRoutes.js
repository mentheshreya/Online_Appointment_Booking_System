const express = require('express');
const { getDoctors, getDoctorById, updateSchedule, getDoctorSlots } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/schedule', protect, updateSchedule);
router.get('/:id/slots', getDoctorSlots);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
