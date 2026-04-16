const express = require('express');
const { createAppointment, getPatientAppointments, getDoctorAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Require authentication for all appointment routes
router.use(protect);

router.post('/', authorize('patient'), createAppointment);
router.get('/patient', authorize('patient'), getPatientAppointments);
router.get('/doctor', authorize('doctor'), getDoctorAppointments);
router.put('/:id/status', authorize('doctor'), updateAppointmentStatus);

module.exports = router;
