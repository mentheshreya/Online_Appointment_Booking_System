'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle';
import Notification, { useNotification } from '../components/Notification';

const genders = ['Male', 'Female', 'Other'];

export default function SignupPage() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState<'patient' | 'doctor'>(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    password: '',
    occupation: '',
    medicalNotes: '',
    specialization: '',
    experience: '',
    location: '',
    qualification: '',
  });
  const { notifications, addNotification, removeNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, age, gender, phone, email, password } = formData;
    if (!name || !age || !gender || !phone || !email || !password) {
      addNotification('Please fill all required fields', 'error');
      return false;
    }
    if (!email.includes('@')) {
      addNotification('Invalid email format', 'error');
      return false;
    }
    if (password.length < 6) {
      addNotification('Password must be at least 6 characters', 'error');
      return false;
    }
    if (Number.isNaN(Number(age)) || Number(age) <= 0) {
      addNotification('Please enter a valid age', 'error');
      return false;
    }
    if (role === 'patient' && (!formData.occupation || !formData.medicalNotes)) {
      addNotification('Please provide occupation and medical notes', 'error');
      return false;
    }
    if (role === 'doctor' && (!formData.specialization || !formData.experience || !formData.location || !formData.qualification)) {
      addNotification('Please fill all doctor fields', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, ...formData }),
      });
      const data = await res.json();
      if (res.ok) {
        addNotification('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => {
          window.location.href = role === 'doctor' ? '/doctor/login' : '/patient/login';
        }, 1200);
      } else {
        addNotification(data.error || 'Registration failed', 'error');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('Unknown error');
      }
      addNotification('Registration failed', 'error');
    }
  };

  return (
    <div>
      <style jsx>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Nunito',sans-serif;background:#fff;min-height:100vh;display:flex;flex-direction:column;}
        nav{background:#d9b3f5;border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;}
        .logo-circle{width:70px;height:70px;background:#fff;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid #ddd;}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:#5a1fa0;letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:#999;letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-btn{background:#fff;border:2px solid #222;border-radius:999px;padding:10px 26px;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;cursor:pointer;}
        .main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;}
        h1{font-size:2.1rem;font-weight:800;font-style:italic;margin-bottom:8px;text-align:center;}
        .sub-text{font-size:1rem;color:#444;margin-bottom:36px;text-align:center;}
        .form-box{background:#fff;border:2px solid #d9b3f5;border-radius:22px;padding:38px 44px;width:100%;max-width:520px;}
        .role-switch{display:flex;gap:12px;justify-content:center;margin-bottom:24px;}
        .role-button{flex:1;border:2px solid #d9b3f5;border-radius:999px;padding:12px 16px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;cursor:pointer;background:#fff;}
        .role-button.active{background:#7b2fff;color:#fff;border-color:#7b2fff;}
        .field{margin-bottom:18px;}
        .field label{display:block;font-weight:700;font-size:.95rem;margin-bottom:8px;}
        .input-wrap{position:relative;display:flex;align-items:center;background:#fff;border:1.8px solid #d9b3f5;border-radius:999px;padding:12px 18px;gap:10px;}
        .input-wrap input,.narrow-input,.wide-input,textarea,select{border:none;outline:none;font-family:'Nunito',sans-serif;font-size:.95rem;flex:1;background:transparent;}
        select{appearance:none;background:transparent;cursor:pointer;width:100%;}
        textarea{resize:vertical;min-height:90px;padding-top:8px;}
        .btn-login{display:block;width:100%;background:#fff;border:2px solid #d9b3f5;border-radius:999px;padding:13px;font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;cursor:pointer;text-align:center;margin-top:10px;transition:background .15s;}
        .btn-login:hover{background:#f0d6ff;}
        .alt-text{margin-top:18px;text-align:center;font-size:.95rem;color:#444;}
        .alt-text a{color:#5a1fa0;font-weight:800;text-decoration:none;}
      `}</style>
      <nav>
        <div className="logo-circle">
          <span className="cross">➕</span>
          <span className="name">MEDISLOT</span>
          <span className="sub">HEALTH CARE SOLUTION</span>
        </div>
        <ThemeToggle />
        <button className="nav-btn">SIGN UP</button>
      </nav>
      <div className="main">
        <h1>Create your account</h1>
        <p className="sub-text">Sign up as a patient or doctor to continue</p>
        <form onSubmit={handleSubmit} className="form-box">
          <div className="role-switch">
            <button type="button" className={`role-button ${role === 'patient' ? 'active' : ''}`} onClick={() => setRole('patient')}>Patient</button>
            <button type="button" className={`role-button ${role === 'doctor' ? 'active' : ''}`} onClick={() => setRole('doctor')}>Doctor</button>
          </div>
          <div className="field">
            <label>Full Name</label>
            <div className="input-wrap">
              <input name="name" type="text" placeholder="Enter full name" value={formData.name} onChange={handleChange} required />
            </div>
          </div>
          <div className="field">
            <label>Age</label>
            <div className="input-wrap">
              <input name="age" type="number" placeholder="Enter age" value={formData.age} onChange={handleChange} required />
            </div>
          </div>
          <div className="field">
            <label>Gender</label>
            <div className="input-wrap">
              <select name="gender" value={formData.gender} onChange={handleChange}>
                {genders.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Contact Number</label>
            <div className="input-wrap">
              <input name="phone" type="tel" placeholder="Enter contact number" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <div className="input-wrap">
              <input name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <input name="password" type="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
          {role === 'patient' ? (
            <>
              <div className="field">
                <label>Occupation</label>
                <div className="input-wrap">
                  <input name="occupation" type="text" placeholder="Enter occupation" value={formData.occupation} onChange={handleChange} required />
                </div>
              </div>
              <div className="field">
                <label>Medical Notes</label>
                <div className="input-wrap">
                  <textarea name="medicalNotes" placeholder="Add medical notes" value={formData.medicalNotes} onChange={handleChange} required />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label>Specialization</label>
                <div className="input-wrap">
                  <input name="specialization" type="text" placeholder="E.g. Cardiologist" value={formData.specialization} onChange={handleChange} required />
                </div>
              </div>
              <div className="field">
                <label>Experience (years)</label>
                <div className="input-wrap">
                  <input name="experience" type="number" placeholder="Enter experience" value={formData.experience} onChange={handleChange} required />
                </div>
              </div>
              <div className="field">
                <label>Location</label>
                <div className="input-wrap">
                  <input name="location" type="text" placeholder="Enter location" value={formData.location} onChange={handleChange} required />
                </div>
              </div>
              <div className="field">
                <label>Qualification</label>
                <div className="input-wrap">
                  <input name="qualification" type="text" placeholder="Enter qualification" value={formData.qualification} onChange={handleChange} required />
                </div>
              </div>
            </>
          )}
          <button type="submit" className="btn-login">CREATE ACCOUNT</button>
          <p className="alt-text">Already have an account? <Link href={role === 'doctor' ? '/doctor/login' : '/patient/login'}>Login</Link></p>
        </form>
      </div>
      {notifications.map((n) => (
        <Notification key={n.id} message={n.message} type={n.type} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
}
