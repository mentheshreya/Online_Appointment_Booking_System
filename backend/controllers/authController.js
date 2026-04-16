const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    let { name, email, password, role, ...profileData } = req.body;
    if (email) email = email.toLowerCase().trim();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Create corresponding profile
    if (role === 'patient') {
      await Patient.create({
        user: user._id,
        phone: profileData.phone || '',
        age: profileData.age || null,
        gender: profileData.gender || '',
        address: profileData.address || '',
        medicalHistory: profileData.medicalHistory || '',
      });
    } else if (role === 'doctor') {
      await Doctor.create({
        user: user._id,
        phone: profileData.phone || '',
        specialization: profileData.specialization || '',
        experience: profileData.experience || 0,
        location: profileData.location || '',
        clinicName: profileData.clinicName || '',
        fees: profileData.fees || 0,
        availableTimeSlots: profileData.availableTimeSlots || ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"], // Default slots for ease
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let profile = null;
    
    if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
    } else {
      profile = await Doctor.findOne({ user: user._id });
    }

    res.json({ user, profile });
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.updateMe = async (req, res) => {
  try {
    const { name, phone, email, specialization, experience, location, qualification } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Update user info
    if (name) user.name = name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.toLowerCase().trim();
    }
    await user.save();
    
    // Update profile info
    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
      if (profile && phone !== undefined) {
        profile.phone = phone;
        await profile.save();
      }
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user._id });
      if (profile) {
        if (phone !== undefined) profile.phone = phone;
        if (specialization !== undefined) profile.specialization = specialization;
        if (experience !== undefined) profile.experience = experience;
        if (location !== undefined) profile.location = location;
        if (qualification !== undefined) profile.clinicName = qualification; // reusing clinicName for qualification
        await profile.save();
      }
    }
    
    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
