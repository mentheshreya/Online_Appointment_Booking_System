'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


interface AppointmentType {
  _id: string;
  timeSlot: string;
  date: string;
  status: string;
  patient: {
    user: { name: string; email: string };
    age?: number;
    medicalHistory?: string;
  }
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { default: api } = await import('../../../services/api');
      const res = await api.get('/auth/me');
      if (res.status === 200) {
        if (res.data.user.role !== 'doctor') {
          window.location.href = '/patient/dashboard';
          return;
        }
        const apptRes = await api.get('/appointments/doctor');
        if (apptRes.status === 200) {
          setAppointments(apptRes.data);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedPatient, setSelectedPatient] = useState<AppointmentType['patient'] | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { default: api } = await import('../../../services/api');
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/doctor/login';
  };

  return (
    <div>
      <style jsx>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Nunito',sans-serif;background:var(--card-bg);min-height:100vh;display:flex;flex-direction:column;}
        nav{background:var(--primary-green-border);border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 15px var(--nav-shadow);}
        .logo-circle{width:70px;height:70px;background:var(--card-bg);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid var(--border-color);flex-shrink:0;}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:var(--primary-purple-border);letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:var(--text-muted);letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-links a{text-decoration:none;color:var(--text-color);font-weight:700;font-size:.95rem;letter-spacing:.5px;}
        .logout-btn{background:var(--card-bg);border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .2s;}
        .logout-btn:hover{background:var(--card-hover);}
        .main{padding:40px 60px;max-width:1050px;margin:0 auto;}
        .appt-box{border:2px solid var(--primary-green-border);border-radius:20px;padding:28px 34px;background:var(--card-bg);position:relative;box-shadow:0 8px 24px var(--nav-shadow);transition:box-shadow .3s;}
        .appt-box:hover{box-shadow:0 12px 32px rgba(168,230,184,0.3);}
        .appt-box .badge{position:absolute;top:-14px;left:28px;background:var(--card-bg);border:1.5px solid var(--primary-green-border);border-radius:999px;padding:4px 14px;font-size:.75rem;font-weight:700;color:var(--text-muted);}
        .appt-title{display:flex;align-items:center;gap:12px;margin-bottom:22px;}
        .appt-title span{font-size:1.7rem;}
        .appt-title h2{font-size:1.5rem;font-weight:800;font-style:italic;}
        .table-header{display:grid;grid-template-columns:160px 1fr 260px;background:var(--card-bg);border:1.8px solid var(--border-color);border-radius:10px;padding:10px 18px;font-weight:800;font-style:italic;font-size:.9rem;margin-bottom:6px;box-shadow:0 2px 8px var(--nav-shadow);}
        .table-row{display:grid;grid-template-columns:160px 1fr 260px;padding:14px 18px;align-items:center;border-bottom:1.5px solid #eee;transition:background .2s;}
        .table-row:hover{background:var(--card-bg);}
        .table-row:last-child{border-bottom:none;}
        .table-row .time{font-style:italic;font-weight:700;font-size:.93rem;}
        .table-row .patient-name{font-weight:600;font-size:.93rem;}
        .view-btn{background:var(--primary-green);color:#ffffff;border:none;border-radius:999px;padding:7px 18px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.82rem;cursor:pointer;transition:all .2s;}
        .view-btn:hover{background:var(--primary-green-border);transform:scale(1.05);}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;}
        .modal{background:var(--card-bg);border-radius:24px;padding:36px;max-width:500px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.2);position:relative;}
        .modal h2{font-size:1.8rem;font-weight:900;margin-bottom:20px;color:var(--text-color);}
        .modal-info{background:var(--card-bg);border:2px solid var(--primary-green-border);border-radius:14px;padding:20px;margin-bottom:20px;}
        .modal-info p{margin-bottom:12px;font-size:1.05rem;}
        .modal-info str{font-weight:800;color:var(--text-muted);}
        .close-modal{background:var(--border-color);color:var(--text-muted);border:none;border-radius:999px;padding:10px 24px;font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;transition:background .2s;}
        .close-modal:hover{background:var(--border-color);}
      `}</style>
      <nav>
        <div className="logo-circle">
          <span className="cross">➕</span>
          <span className="name">MEDISLOT</span>
          <span className="sub">HEALTH CARE SOLUTION</span>
        </div>
        <div className="nav-links">
          <Link href="/doctor/dashboard">DASHBOARD</Link>
          <Link href="/doctor/schedule">SCHEDULE</Link>
          <Link href="/doctor/profile">PROFILE</Link>
          
          <button className="logout-btn" onClick={handleLogout}>👤 LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <div className="appt-box">
          <div className="badge">✦ All Appointments</div>
          <div className="appt-title">
            <span>📅</span>
            <h2>Current Appointments</h2>
          </div>
          <div className="table-header">
            <div>Date & Time</div>
            <div>Patient Name</div>
            <div>Action</div>
          </div>
          {loading ? <p>Loading...</p> : appointments.length === 0 ? <p>No appointments found.</p> : appointments.map((appt) => (
            <div key={appt._id} className="table-row">
              <div className="time">{new Date(appt.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} at {appt.timeSlot}</div>
              <div className="patient-name">{appt.patient?.user?.name || 'Unknown Patient'} {appt.status !== 'pending' && <span style={{fontSize: '0.8rem', color: appt.status === 'accepted' ? 'var(--primary-green)' : '#e74c3c'}}>({appt.status})</span>}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="view-btn" style={{ background: 'var(--primary-purple)' }} onClick={() => setSelectedPatient(appt.patient)}>View Profile</button>
                {appt.status === 'pending' && (
                  <>
                    <button className="view-btn" onClick={() => handleStatusUpdate(appt._id, 'accepted')} style={{ background: 'var(--primary-green)' }}>Accept</button>
                    <button className="view-btn" onClick={() => handleStatusUpdate(appt._id, 'rejected')} style={{ background: '#e74c3c' }}>Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Patient Details</h2>
            <div className="modal-info">
              <p><span className="str">Name:</span> {selectedPatient.user?.name || 'Unknown'}</p>
              <p><span className="str">Email:</span> {selectedPatient.user?.email || 'Unknown'}</p>
              <p><span className="str">Age:</span> {selectedPatient.age || 'Not specified'}</p>
              <p><span className="str">Medical History:</span> {selectedPatient.medicalHistory || 'None provided'}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="close-modal" onClick={() => setSelectedPatient(null)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}