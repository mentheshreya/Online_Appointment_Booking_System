'use client';

import Link from 'next/link';

import { useState, useEffect } from 'react';

interface DoctorSummary {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  location: string;
  qualification: string;
}

interface AppointmentSummary {
  _id: string;
  date: string;
  time: string;
  status: string;
  doctor: {
    name: string;
    email: string;
  };
}

export default function PatientDashboard() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);

  const fetchDoctors = async (query = '') => {
    try {
      const { default: api } = await import('../../../services/api');
      const res = await api.get(`/doctors${query}`);
      if (res.status === 200) {
        // Adjust for populated user mapping
        const mappedDoctors = res.data.map((doc: any) => ({
          ...doc,
          name: doc.user?.name || 'Unknown',
          email: doc.user?.email || ''
        }));
        setDoctors(mappedDoctors);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location && location !== 'CITY') params.append('location', location);
    if (specialization) params.append('specialization', specialization);
    fetchDoctors(`?${params.toString()}`);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchAppointments = async () => {
      if (!token) return;
      try {
        const { default: api } = await import('../../../services/api');
        const authRes = await api.get('/auth/me');
        if (authRes.status === 200 && authRes.data.user.role !== 'patient') {
          window.location.href = '/doctor/dashboard';
          return;
        }
        
        const res = await api.get('/appointments/patient');
        if (res.status === 200) {
          const mappedAppts = res.data.map((appt: any) => ({
            _id: appt._id,
            date: appt.date,
            time: appt.timeSlot,
            status: appt.status,
            doctor: {
              name: appt.doctor.user.name,
              email: appt.doctor.user.email,
            }
          }));
          setAppointments(mappedAppts);
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    Promise.all([fetchDoctors(), fetchAppointments()]).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <style jsx>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Nunito',sans-serif;background:var(--card-bg);min-height:100vh;display:flex;flex-direction:column;}
        nav{background:var(--primary-purple-border);border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;}
        .logo-circle{width:70px;height:70px;background:var(--card-bg);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid var(--border-color);flex-shrink:0;}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:var(--primary-purple-border);letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:var(--text-muted);letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-links a{text-decoration:none;color:var(--text-color);font-weight:700;font-size:.95rem;letter-spacing:.5px;}
        .logout-btn{background:var(--card-bg);border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:7px;}
        .main{padding:40px 48px;}
        .main h2{font-size:1.8rem;font-weight:800;font-style:italic;margin-bottom:28px;}
        .filters{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px;}
        .select-wrap{position:relative;}
        .select-wrap select{appearance:none;border:1.8px solid var(--border-color);border-radius:8px;padding:11px 44px 11px 16px;font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;background:var(--card-bg);cursor:pointer;min-width:140px;}
        .select-wrap::after{content:'▼';position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:.7rem;pointer-events:none;}
        .spec-input{border:1.8px solid var(--border-color);border-radius:8px;padding:11px 16px;font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;min-width:180px;}
        .submit-btn{background:var(--primary-purple);color:#ffffff;border:none;border-radius:999px;padding:11px 32px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;cursor:pointer;}
        .submit-btn:hover{background:var(--primary-purple);}
        .filter-tag{background:var(--primary-purple);color:#ffffff;border:none;border-radius:999px;padding:8px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.88rem;cursor:pointer;display:flex;align-items:center;gap:6px;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:24px;}
        .doctor-card{background:var(--card-bg);border:2px solid var(--primary-purple-border);border-radius:18px;padding:20px 22px;display:flex;align-items:center;gap:18px;position:relative;transition:all .25s ease;box-shadow:0 6px 16px var(--nav-shadow);}
        .doctor-card:hover{box-shadow:0 12px 28px rgba(123,47,255,0.15);transform:translateY(-3px);border-color:var(--primary-purple);}
        .doc-img{width:88px;height:88px;border-radius:12px;background:var(--primary-purple-bg);display:flex;align-items:center;justify-content:center;font-size:2.8rem;flex-shrink:0;overflow:hidden;}
        .doc-info h3{font-size:1.1rem;font-weight:800;margin-bottom:4px;color:var(--text-color);}
        .doc-info .spec{font-size:.88rem;color:var(--primary-purple);font-weight:700;margin-bottom:4px;background:var(--primary-purple-bg);display:inline-block;padding:2px 8px;border-radius:6px;}
        .doc-info .rating{font-size:.85rem;color:var(--text-muted);display:flex;align-items:center;gap:5px;margin-bottom:6px;}
        .doc-info .location{font-size:.82rem;color:var(--text-muted);display:flex;align-items:center;gap:4px;}
        .view-btn{background:var(--primary-purple);color:#ffffff;border:none;border-radius:999px;padding:10px 22px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.85rem;cursor:pointer;text-decoration:none;white-space:nowrap;transition:background .2s, transform .1s;}
        .view-btn:hover{background:#6a20ee;transform:scale(1.03);}
        .star{color:#f5a623;font-size:1rem;}
        .history-section{background:var(--card-bg);border:2px solid var(--primary-purple-border);border-radius:18px;padding:24px;margin-bottom:20px;}
        .history-section h3{font-size:1.4rem;font-weight:800;margin-bottom:16px;}
        .history-item{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee;}
        .history-item:last-child{border-bottom:none;}
        .history-item .date{font-weight:600;}
        .history-item .doctor{font-size:.9rem;color:var(--text-muted);}
        .history-item .status{background:#a3e4b0;color:#ffffff;border-radius:999px;padding:4px 12px;font-size:.8rem;font-weight:700;}
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
          <Link href="#appointments">MY APPOINTMENTS</Link>
          <Link href="/patient/profile">PROFILE</Link>
          
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>👤 LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <h2>Find Doctors near You!</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="spec-input"
            style={{ flex: 1 }}
          />
          <div className="select-wrap">
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">CITY</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          <input
            className="spec-input"
            type="text"
            placeholder="SPECIALIZATION"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSearch}>SUBMIT</button>
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
          ) : doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <div className="doc-img">👩‍⚕️</div>
                <div className="doc-info">
                  <h3>{doctor.name}</h3>
                  <div className="spec">{doctor.specialization}</div>
                  <div className="rating">Experience: {doctor.experience} years</div>
                  <div className="location">📍 {doctor.location}</div>
                  <div className="rating">{doctor.qualification}</div>
                </div>
                <Link href={`/doctor/${doctor._id}`} className="view-btn">View Profile</Link>
              </div>
            ))
          ) : (
            <p>No doctors found for your search.</p>
          )}
        </div>
        <div className="history-section">
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
        <div className="history-section" id="appointments" style={{ marginTop: '40px' }}>
          <h3>My Appointments</h3>
          {appointments.length > 0 ? appointments.map((appt) => (
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