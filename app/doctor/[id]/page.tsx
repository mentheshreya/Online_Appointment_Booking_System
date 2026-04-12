'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import { useState, useEffect } from 'react';

interface DoctorDetail {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  location: string;
  qualification: string;
}

export default function DoctorProfile({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${params.id}`);
        if (res.ok) {
          const doctorData = await res.json();
          setDoctor(doctorData);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading doctor profile...</div>;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500">
        <p className="text-xl font-bold">Doctor not found</p>
      </div>
    );
  }

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
        .logout-btn{background:#fff;border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;}
        .main{padding:40px 80px;max-width:860px;margin:0 auto;width:100%;}
        .main h2{font-size:1.7rem;font-weight:800;text-align:center;margin-bottom:30px;}
        .profile-card{border:2px solid #e0b3f8;border-radius:18px;padding:24px 28px;display:flex;align-items:center;gap:22px;margin-bottom:18px;}
        .doc-img{width:90px;height:90px;border-radius:12px;background:#e8e8e8;display:flex;align-items:center;justify-content:center;font-size:3rem;flex-shrink:0;overflow:hidden;}
        .profile-info h3{font-size:1.1rem;font-weight:800;margin-bottom:4px;}
        .profile-info .spec{font-size:.88rem;color:#555;margin-bottom:4px;}
        .profile-info .rating{font-size:.85rem;display:flex;align-items:center;gap:5px;margin-bottom:4px;}
        .profile-info .location{font-size:.82rem;color:#555;}
        .about-card{border:2px solid #e0b3f8;border-radius:18px;padding:22px 28px;margin-bottom:18px;}
        .about-card h4{font-weight:800;font-size:.95rem;text-align:center;margin-bottom:12px;}
        .about-card p{font-style:italic;font-size:.92rem;color:#333;line-height:1.6;}
        .exp-card{border:2px solid #e0b3f8;border-radius:18px;padding:22px 28px;}
        .exp-card h4{font-weight:800;font-style:italic;font-size:.95rem;margin-bottom:18px;}
        .slots{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;}
        .slot{border:1.8px solid #ccc;border-radius:10px;padding:9px 18px;font-size:.88rem;font-weight:700;background:#fff;cursor:pointer;transition:background .15s;}
        .slot:hover,.slot.active{background:#f0d6ff;border-color:#b06fd6;}
        .book-btn{display:block;width:fit-content;margin:0 auto;background:#7b2fff;color:#fff;border:none;border-radius:999px;padding:13px 44px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;cursor:pointer;}
        .book-btn:hover{background:#6a20ee;}
        .back-row{margin-top:20px;display:flex;gap:10px;}
        .back-button{border:2px solid #a8a8a8;color:#444;border-radius:999px;padding:7px 14px;font-weight:700;cursor:pointer;background:#fff;}
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
          <Link href="#">PROFILE</Link>
          <ThemeToggle />
          <button className="logout-btn">LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <h2>Doctor Profile</h2>
        <div className="profile-card">
          <div className="doc-img">👩‍⚕️</div>
          <div className="profile-info">
            <h3>{doctor.name}</h3>
            <div className="spec">{doctor.specialization}</div>
            <div className="rating">{doctor.experience} years experience</div>
            <div className="location">📍 {doctor.location}</div>
            <div className="qualification">{doctor.qualification}</div>
          </div>
        </div>
        <div className="about-card">
          <h4>About Doctor</h4>
          <p>{doctor.name} is a highly experienced {doctor.specialization?.toLowerCase()} helping patients with compassionate care and modern treatment plans.</p>
        </div>
        <div className="exp-card">
          <h4>Experience & Details:</h4>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                border: '1.8px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div className="slots">
            {['10:00 AM', '11:00 AM', '12:30 PM', '1:30 PM', '02:00 PM'].map((slot) => (
              <button
                key={slot}
                className={`slot ${selectedSlot === slot ? 'active' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
          <button className="book-btn" onClick={async () => {
            if (!selectedDate || !selectedSlot) {
              alert('Please select date and time');
              return;
            }
            const token = localStorage.getItem('token');
            const res = await fetch('/api/appointments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                doctorId: params.id,
                date: selectedDate,
                time: selectedSlot,
              }),
            });
            if (res.ok) {
              alert('Appointment booked!');
            } else {
              alert('Failed to book');
            }
          }}>BOOK APPOINTMENT</button>
        </div>
        <div className="back-row">
          <button className="back-button" onClick={() => router.back()}>Back</button>
          <Link className="back-button" href="/patient/dashboard">Patient Dashboard</Link>
        </div>
      </div>
    </div>
  );
}