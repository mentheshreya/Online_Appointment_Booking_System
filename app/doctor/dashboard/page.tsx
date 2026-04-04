'use client';

import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';

const appointments = [
  { time: '10.00 AM', patient: 'Meena Wale' },
  { time: '11.00 AM', patient: 'Priya Menthe' },
  { time: '01.00 PM', patient: 'Sai Patil' },
  { time: '03.00 PM', patient: 'Shruti Pande' },
];

export default function DoctorDashboard() {
  return (
    <div>
      <style jsx>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Nunito',sans-serif;background:#fff;min-height:100vh;display:flex;flex-direction:column;}
        nav{background:#a8e6b8;border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;}
        .logo-circle{width:70px;height:70px;background:#fff;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid #ddd;flex-shrink:0;}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:#5a1fa0;letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:#999;letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-links a{text-decoration:none;color:#222;font-weight:700;font-size:.95rem;letter-spacing:.5px;}
        .logout-btn{background:#fff;border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:7px;}
        .main{padding:40px 60px;max-width:900px;}
        .appt-box{border:2px solid #a8e6b8;border-radius:20px;padding:28px 34px;background:#fff;position:relative;}
        .appt-box .badge{position:absolute;top:-14px;left:28px;background:#fff;border:1.5px solid #a8e6b8;border-radius:999px;padding:4px 14px;font-size:.75rem;font-weight:700;color:#555;}
        .appt-title{display:flex;align-items:center;gap:12px;margin-bottom:22px;}
        .appt-title span{font-size:1.7rem;}
        .appt-title h2{font-size:1.5rem;font-weight:800;font-style:italic;}
        .table-header{display:grid;grid-template-columns:160px 1fr 140px;background:#fff;border:1.8px solid #ddd;border-radius:10px;padding:10px 18px;font-weight:800;font-style:italic;font-size:.9rem;margin-bottom:6px;}
        .table-row{display:grid;grid-template-columns:160px 1fr 140px;padding:14px 18px;align-items:center;border-bottom:1.5px solid #eee;}
        .table-row:last-child{border-bottom:none;}
        .table-row .time{font-style:italic;font-weight:700;font-size:.93rem;}
        .table-row .patient-name{font-weight:600;font-size:.93rem;}
        .view-btn{background:#3ab55a;color:#fff;border:none;border-radius:999px;padding:7px 18px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.82rem;cursor:pointer;}
        .view-btn:hover{background:#2a9e49;}
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
          <Link href="#">PROFILE</Link>
          <ThemeToggle />
          <button className="logout-btn">👤 LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <div className="appt-box">
          <div className="badge">✦ Today's Appointments</div>
          <div className="appt-title">
            <span>📅</span>
            <h2>Today's Appointment</h2>
          </div>
          <div className="table-header">
            <div>Time</div>
            <div>Patient Name</div>
            <div>Action</div>
          </div>
          {appointments.map((appt, index) => (
            <div key={index} className="table-row">
              <div className="time">{appt.time}</div>
              <div className="patient-name">{appt.patient}</div>
              <div><button className="view-btn">View Profile</button></div>
            </div>
          ))}
        </div>
        <div className="appt-box" style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Weekly Stats</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} style={{ textAlign: 'center' }}>
                <div style={{ height: `${(i + 1) * 20}px`, background: '#a8e6b8', width: '30px', margin: '0 auto' }}></div>
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>{day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}