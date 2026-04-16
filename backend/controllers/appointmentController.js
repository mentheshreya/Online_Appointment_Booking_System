const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const sendEmail = require('../services/emailService');
const moment = require('mongoose');

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    
    // doctorId is the ID of the Doctor profile.
    // The currently logged in user is req.user. We need their Patient profile.
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can book appointments.' });
    }

    const patient = await Patient.findOne({ user: req.user._id }).populate('user');
    const doctor = await Doctor.findById(doctorId).populate('user');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Strictly prevent double booking: Date and TimeSlot for the specific Doctor
    // Check if an appointment already exists for this doctor, date, and slot with status pending or accepted
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot: timeSlot,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked for this doctor.' });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: 'pending'
    });

    // Send Emails
    const appointmentDateStr = new Date(date).toDateString();
    
    // To Patient
    await sendEmail({
      email: patient.user.email,
      subject: 'Appointment Request Submitted',
      message: `Dear ${patient.user.name},\n\Your appointment request with Dr. ${doctor.user.name} on ${appointmentDateStr} at ${timeSlot} has been submitted and is currently pending approval.\n\nThank you.`
    });

    // To Doctor
    await sendEmail({
      email: doctor.user.email,
      subject: 'New Appointment Request',
      message: `Dear Dr. ${doctor.user.name},\n\nYou have a new appointment request from ${patient.user.name} for ${appointmentDateStr} at ${timeSlot}. Please log in to your dashboard to accept or reject it.\n\nThank you.`
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const appointments = await Appointment.find({ patient: patient._id })
      .populate({ 
        path: 'doctor', 
        populate: { path: 'user', select: 'name email' } 
      })
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    // Populate full patient profile including their user object for name/email
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({ 
        path: 'patient', 
        populate: { path: 'user', select: 'name email' } 
      })
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    
    if (!['accepted', 'rejected'].includes(status)) {
       return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'patient', populate: { path: 'user' }})
      .populate({ path: 'doctor', populate: { path: 'user' }});

    if (!appointment) {
       return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify it's the right doctor
    if (appointment.doctor.user._id.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    // Send Email to Patient
    const appointmentDateStr = new Date(appointment.date).toDateString();
    await sendEmail({
      email: appointment.patient.user.email,
      subject: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Dear ${appointment.patient.user.name},\n\Your appointment request with Dr. ${appointment.doctor.user.name} on ${appointmentDateStr} at ${appointment.timeSlot} has been ${status}.\n\nThank you.`
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
