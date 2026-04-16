const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.getDoctors = async (req, res) => {
  try {
    const { search, specialization, location } = req.query;
    
    // We want to search doctors
    // Specialization and location can be direct matches or regex. 
    // Search can apply to the user's name which requires populating or an aggregate query.
    // Let's use simple filters on Doctor, and if search is provided, filter by populated user.name AFTERWARDS (easy for small datasets), or lookup.
    
    let query = {};
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    let doctors = await Doctor.find(query).populate('user', 'name email profilePhoto');
    
    if (search) {
      // Filter the results where user name matches the search text
      doctors = doctors.filter(doc => 
        doc.user && doc.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { availableTimeSlots, blockedDates, dateSpecificSlots } = req.body;
    
    // Ensure the current user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update schedules' });
    }
    
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;
    if (blockedDates) {
      doctor.blockedDates = blockedDates;
      doctor.markModified('blockedDates');
    }
    if (dateSpecificSlots) {
      doctor.dateSpecificSlots = dateSpecificSlots;
      doctor.markModified('dateSpecificSlots');
    }
    
    await doctor.save();
    
    res.json({ message: 'Schedule updated successfully', availableTimeSlots: doctor.availableTimeSlots, blockedDates: doctor.blockedDates, dateSpecificSlots: doctor.dateSpecificSlots });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getDoctorSlots = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(400).json({ message: 'Date query param is required' });
    
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    // Check if the exact date string is in blockedDates
    const isBlocked = doctor.blockedDates.includes(date);
    if (isBlocked) {
      return res.json({ availableTimeSlots: [], bookedSlots: [], addedSlots: [], isBlocked: true });
    }
    
    // Find custom slots added by the doctor specifically for this date
    let addedSlots = [];
    if (doctor.dateSpecificSlots && doctor.dateSpecificSlots.length > 0) {
      const specificSlotObj = doctor.dateSpecificSlots.find(d => d.date === date);
      if (specificSlotObj) {
        addedSlots = specificSlotObj.slots;
      }
    }
    
    // Query appointments for this doctor on this date
    const startDate = new Date(date);
    startDate.setUTCHours(0,0,0,0);
    const endDate = new Date(date);
    endDate.setUTCHours(23,59,59,999);
    
    // Find all appointments that are pending or accepted
    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({
      doctor: doctor._id,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['pending', 'accepted'] }
    });
    
    const bookedSlots = appointments.map(app => app.timeSlot);
    
    res.json({ availableTimeSlots: doctor.availableTimeSlots, addedSlots, bookedSlots, isBlocked: false });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
