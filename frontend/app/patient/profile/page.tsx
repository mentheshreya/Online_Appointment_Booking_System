'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useNotification } from '../../components/Notification';

export default function PatientProfile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const { addNotification } = useNotification();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { default: api } = await import('../../../services/api');
        const res = await api.get('/auth/me');
        if (res.status === 200) {
          if (res.data.user.role !== 'patient') {
            window.location.href = '/doctor/profile';
            return;
          }
          const data = res.data;
          setUser({
            name: data.user.name,
            email: data.user.email,
            phone: data.profile.phone,
            createdAt: data.user.createdAt,
          });
          setFormData({ name: data.user.name, email: data.user.email, phone: data.profile.phone });
        }
      } catch (error) {
        addNotification('Failed to load profile', 'error');
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

      try {
        setUser({ ...user, name: formData.name, email: formData.email, phone: formData.phone });
        setIsEditing(false);
        addNotification('Profile updated successfully', 'success');
      } catch (error) {
        addNotification('Failed to update profile', 'error');
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/patient/login';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-purple-border)' }}>Loading Profile...</div>;

  return (
    <div>
      <style jsx>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Nunito',sans-serif;background:var(--card-bg);min-height:100vh;display:flex;flex-direction:column;}
        nav{background:var(--primary-purple-border);border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 15px var(--nav-shadow);}
        .logo-circle{width:70px;height:70px;background:var(--card-bg);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid var(--border-color);flex-shrink:0;}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:var(--primary-purple-border);letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:var(--text-muted);letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-links a{text-decoration:none;color:var(--text-color);font-weight:700;font-size:.95rem;letter-spacing:.5px;transition:color .2s;}
        .nav-links a:hover, .nav-links a.active{color:var(--primary-purple);}
        .logout-btn{background:var(--card-bg);border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .2s;}
        .logout-btn:hover{background:var(--primary-purple-bg);border-color:var(--primary-purple);color:var(--primary-purple);}
        .main{padding:40px 80px;max-width:960px;margin:0 auto;width:100%;}
        .main h2{font-size:1.9rem;font-weight:800;font-style:italic;margin-bottom:28px;}
        
        .profile-container{background:var(--card-bg);border:2px solid var(--primary-purple-border);border-radius:18px;padding:36px 40px;display:flex;gap:36px;margin-bottom:30px;box-shadow:0 6px 20px var(--nav-shadow);}
        
        .avatar-section{position:relative;flex-shrink:0;width:140px;height:140px;border-radius:50%;background:var(--primary-purple-bg);border:3px solid var(--primary-purple-border);display:flex;align-items:center;justify-content:center;font-size:4rem;overflow:hidden;cursor:pointer;transition:transform .2s;}
        .avatar-section:hover{transform:scale(1.02);border-color:var(--primary-purple);}
        .avatar-section img{width:100%;height:100%;object-fit:cover;}
        
        .camera-badge{position:absolute;bottom:5px;right:5px;background:var(--primary-purple);color:#ffffff;border:2px solid #fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;box-shadow:0 4px 10px var(--shadow-purple);transition:all .2s;}
        .camera-badge:hover{background:var(--primary-purple-border);transform:scale(1.1);}
        
        .info-section{flex:1;}
        .info-section h3{font-size:2.2rem;font-weight:900;color:var(--text-color);margin-bottom:14px;}
        .info-row{display:flex;align-items:center;gap:12px;font-size:1.05rem;color:var(--text-muted);margin-bottom:10px;}
        .info-row .icon{background:var(--primary-purple-bg);color:var(--primary-purple);width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;}
        .info-row strong{color:var(--text-color);font-weight:800;}
        
        .edit-btn{background:var(--primary-purple);color:#ffffff;border:none;border-radius:999px;padding:12px 32px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;cursor:pointer;transition:all .2s;opacity:0.95;margin-top:20px;display:inline-block;}
        .edit-btn:hover{opacity:1;transform:translateY(-2px);box-shadow:0 6px 15px var(--shadow-purple);}
        
        .edit-form{display:flex;flex-direction:column;gap:16px;max-width:400px;}
        .input-group{display:flex;flex-direction:column;gap:6px;}
        .input-group label{font-weight:800;font-size:.9rem;color:var(--text-muted);}
        .input-group input{border:2px solid var(--primary-purple-border);border-radius:10px;padding:12px 16px;font-family:'Nunito',sans-serif;font-size:.95rem;transition:border-color .2s;outline:none;}
        .input-group input:focus{border-color:var(--primary-purple);}
        .form-actions{display:flex;gap:12px;margin-top:10px;}
        .save-btn{background:var(--primary-purple);color:#ffffff;border:none;border-radius:999px;padding:12px 28px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;cursor:pointer;transition:all .2s;}
        .save-btn:hover{background:var(--primary-purple-border);}
        .cancel-btn{background:var(--card-bg);color:var(--text-muted);border:2px solid var(--border-color);border-radius:999px;padding:10px 24px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;cursor:pointer;transition:all .2s;}
        .cancel-btn:hover{background:var(--card-hover);border-color:var(--text-muted);color:var(--text-color);}
      `}</style>
      <nav>
        <div className="logo-circle">
          <span className="cross">➕</span>
          <span className="name">MEDISLOT</span>
          <span className="sub">HEALTH CARE SOLUTION</span>
        </div>
        <div className="nav-links">
          <Link href="/patient/dashboard">HOME</Link>
          <Link href="/patient/dashboard#appointments">MY APPOINTMENTS</Link>
          <Link href="/patient/profile" className="active">PROFILE</Link>
          
          <button className="logout-btn" onClick={handleLogout}>👤 LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <h2>My Profile</h2>
        <div className="profile-container">
          <div style={{ position: 'relative' }}>
            <div 
              className="avatar-section" 
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              {photoPreview ? <img src={photoPreview} alt="User" /> : '👤'}
            </div>
            <div 
              className="camera-badge" 
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              📷
            </div>
            <input type="file" id="photo-upload" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
          </div>
          
          <div className="info-section">
            {isEditing ? (
              <div className="edit-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                  <button className="cancel-btn" onClick={handleEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3>{user.name}</h3>
                <div className="info-row">
                  <div className="icon">✉️</div>
                  <span><strong>Email:</strong> {user.email}</span>
                </div>
                <div className="info-row">
                  <div className="icon">📱</div>
                  <span><strong>Phone:</strong> {user.phone || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <div className="icon">📅</div>
                  <span><strong>Memeber Since:</strong> {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <button className="edit-btn" onClick={handleEdit}>Edit Profile Details</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}