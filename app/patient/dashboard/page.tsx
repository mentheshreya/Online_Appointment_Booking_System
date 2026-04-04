'use client';

import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import { useState, useEffect } from 'react';

const doctors = [
  { id: 1, name: 'Dr. Rahul Mehta', spec: 'Cardiologist', rating: 4.9, reviews: 198, location: 'Kothrud', img: '🧑‍⚕️' },
  { id: 2, name: 'Dr. Shravani Kalapure', spec: 'Dentist', rating: 4.1, reviews: 144, location: 'Akurdi', img: '👩‍⚕️' },
  { id: 3, name: 'Dr. Shreya Menthe', spec: 'Dermatologist', rating: 4.2, reviews: 98, location: 'Pune', img: '👩‍⚕️' },
  { id: 4, name: 'Dr. Abhishek Singh', spec: 'Gynecologist', rating: 4.9, reviews: 198, location: 'Aundh', img: '🧑‍⚕️' },
];

export default function PatientDashboard() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.spec.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch('/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      }
    };
    fetchAppointments();
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return (
    <div>
      <style jsx>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Nunito',sans-serif;background:#fff;min-height:100vh;display:flex;flex-direction:column;}
        nav{background:#d9b3f5;border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;}
        .logo-circle{width:70px;height:70px;background:#fff;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid #ddd;flex-shrink:0;}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:#5a1fa0;letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:#999;letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-links a{text-decoration:none;color:#222;font-weight:700;font-size:.95rem;letter-spacing:.5px;}
        .logout-btn{background:#fff;border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:7px;}
        .main{padding:40px 48px;}
        .main h2{font-size:1.8rem;font-weight:800;font-style:italic;margin-bottom:28px;}
        .filters{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px;}
        .select-wrap{position:relative;}
        .select-wrap select{appearance:none;border:1.8px solid #bbb;border-radius:8px;padding:11px 44px 11px 16px;font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;background:#fff;cursor:pointer;min-width:140px;}
        .select-wrap::after{content:'▼';position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:.7rem;pointer-events:none;}
        .spec-input{border:1.8px solid #bbb;border-radius:8px;padding:11px 16px;font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;min-width:180px;}
        .submit-btn{background:#6a0dad;color:#fff;border:none;border-radius:999px;padding:11px 32px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;cursor:pointer;}
        .submit-btn:hover{background:#5a0bab;}
        .filter-tag{background:#7b2fff;color:#fff;border:none;border-radius:999px;padding:8px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.88rem;cursor:pointer;display:flex;align-items:center;gap:6px;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:24px;}
        .doctor-card{border:2px solid #e0b3f8;border-radius:18px;padding:20px 22px;display:flex;align-items:center;gap:18px;position:relative;}
        .doc-img{width:88px;height:88px;border-radius:12px;background:#e8e8e8;display:flex;align-items:center;justify-content:center;font-size:2.5rem;flex-shrink:0;overflow:hidden;}
        .doc-info h3{font-size:1.05rem;font-weight:800;margin-bottom:4px;}
        .doc-info .spec{font-size:.88rem;color:#555;margin-bottom:4px;}
        .doc-info .rating{font-size:.85rem;color:#444;display:flex;align-items:center;gap:5px;margin-bottom:6px;}
        .doc-info .location{font-size:.82rem;color:#555;display:flex;align-items:center;gap:4px;}
        .view-btn{background:#7b2fff;color:#fff;border:none;border-radius:999px;padding:8px 18px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.82rem;cursor:pointer;text-decoration:none;white-space:nowrap;}
        .view-btn:hover{background:#6a20ee;}
        .star{color:#f5a623;font-size:1rem;}
        .history-section{background:#fff;border:2px solid #d9b3f5;border-radius:18px;padding:24px;margin-bottom:20px;}
        .history-section h3{font-size:1.4rem;font-weight:800;margin-bottom:16px;}
        .history-item{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee;}
        .history-item:last-child{border-bottom:none;}
        .history-item .date{font-weight:600;}
        .history-item .doctor{font-size:.9rem;color:#555;}
        .history-item .status{background:#a3e4b0;color:#fff;border-radius:999px;padding:4px 12px;font-size:.8rem;font-weight:700;}
        .skeleton{background:#e0e0e0;border-radius:8px;margin-bottom:8px;}
        .skeleton-img{width:88px;height:88px;}
        .skeleton-text{height:16px;width:60%;margin-bottom:8px;}
        .skeleton-btn{height:32px;width:100px;}
        @media(max-width:640px){.grid{grid-template-columns:1fr;}}
      `}</style>
      <nav>
        <div className="logo-circle">
          <span className="cross">➕</span>
          <span className="name">MEDISLOT</span>
          <span className="sub">HEALTH CARE SOLUTION</span>
        </div>
        <div className="nav-links">
          <Link href="/patient/dashboard">HOME</Link>
          <Link href="#">MY APPOINTMENTS</Link>
          <Link href="/patient/profile">PROFILE</Link>
          <ThemeToggle />
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>👤 LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <h2>Find Doctors near You!</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="spec-input"
            style={{ flex: 1 }}
          />
          <div className="select-wrap">
            <select><option>STATE</option><option>Maharashtra</option><option>Karnataka</option></select>
          </div>
          <div className="select-wrap">
            <select><option>DISTRICT</option><option>Pune</option><option>Mumbai</option></select>
          </div>
          <input className="spec-input" type="text" placeholder="SPECIALIZATION" />
          <button className="submit-btn">SUBMIT</button>
        </div>
        <div style={{ marginTop: '10px' }}>
          <button className="filter-tag">Filters ⊿</button>
        </div>
        <div className="grid">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="doctor-card">
                <div className="skeleton skeleton-img"></div>
                <div className="doc-info">
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '30%' }}></div>
                </div>
                <div className="skeleton skeleton-btn"></div>
              </div>
            ))
          ) : (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doc-img">{doctor.img}</div>
                <div className="doc-info">
                  <h3>{doctor.name}</h3>
                  <div className="spec">{doctor.spec}</div>
                  <div className="rating"><span className="star">⭐</span> {doctor.rating} ({doctor.reviews} reviews)</div>
                  <div className="location">📍 {doctor.location}</div>
                </div>
                <Link href={`/doctor/${doctor.id}`} className="view-btn">View Profile</Link>
              </div>
            ))
          )}
        </div>
        <div className="history-section" style={{ marginTop: '20px' }}>
          <h3>Recommended for You</h3>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
            <div className="doctor-card">
              <div className="doc-img">👨‍⚕️</div>
              <div className="doc-info">
                <h3>Dr. New Specialist</h3>
                <div className="spec">Neurologist</div>
                <div className="rating"><span className="star">⭐</span> 4.8 (120 reviews)</div>
                <div className="location">📍 Mumbai</div>
              </div>
              <Link href="#" className="view-btn">View Profile</Link>
            </div>
          </div>
        </div>
        <div className="history-section" style={{ marginTop: '40px' }}>
          <h3>My Appointments</h3>
          {appointments.length > 0 ? appointments.map((appt: any) => (
            <div key={appt._id} className="history-item">
              <div>
                <div className="date">{new Date(appt.date).toDateString()} - {appt.time}</div>
                <div className="doctor">{appt.doctor.name} - {appt.doctor.email}</div>
              </div>
              <div className="status">{appt.status}</div>
            </div>
          )) : (
            <p>No appointments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}