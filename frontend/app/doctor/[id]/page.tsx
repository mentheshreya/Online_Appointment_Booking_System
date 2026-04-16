'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { useState, useEffect } from 'react';

interface DoctorDetail {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  location: string;
  qualification: string;
}

export default function DoctorProfile() {
  const params = useParams();
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const STANDARD_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const [allSlots, setAllSlots] = useState<string[]>(STANDARD_SLOTS);
  const [addedSlots, setAddedSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { default: api } = await import('../../../services/api');
        const res = await api.get(`/doctors/${params.id}`);
        if (res.status === 200) {
          setDoctor({
            ...res.data,
            name: res.data.user?.name || 'Unknown',
            email: res.data.user?.email || '',
          });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [params.id]);

  useEffect(() => {
    if (!selectedDate || !params.id) return;
    
    const fetchSlotsForDate = async () => {
      setSlotsLoading(true);
      try {
        const { default: api } = await import('../../../services/api');
        const res = await api.get(`/doctors/${params.id}/slots?date=${selectedDate}`);
        if (res.status === 200) {
          const doctorAdded = res.data.addedSlots || [];
          setAddedSlots(doctorAdded);
          setBookedSlots(res.data.bookedSlots || []);
          setIsBlocked(res.data.isBlocked || false);
          
          const merged = Array.from(new Set([...STANDARD_SLOTS, ...doctorAdded]));
          
          // Simple time string sort
          merged.sort((a, b) => {
            const timeA = new Date('1970/01/01 ' + a).getTime();
            const timeB = new Date('1970/01/01 ' + b).getTime();
            return timeA - timeB;
          });
          
          setAllSlots(merged);
          setSelectedSlot(''); 
        }
      } catch(err: any) {
        console.error(err);
      } finally {
        setSlotsLoading(false);
      }
    };
    
    fetchSlotsForDate();
  }, [selectedDate, params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-purple-600">Loading doctor profile...</div>;
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
        body{font-family:'Nunito',sans-serif;background:var(--card-bg);min-height:100vh;display:flex;flex-direction:column;}
        nav{background:var(--primary-purple-border);border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 15px var(--nav-shadow);}
        .logo-circle{width:70px;height:70px;background:var(--card-bg);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid var(--border-color);flex-shrink:0;}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:var(--primary-purple-border);letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:var(--text-muted);letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-links a{text-decoration:none;color:var(--text-color);font-weight:700;font-size:.95rem;letter-spacing:.5px;transition:color .2s;}
        .nav-links a:hover{color:var(--primary-purple);}
        .logout-btn{background:var(--card-bg);border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s;}
        .logout-btn:hover{background:var(--primary-purple-bg);border-color:var(--primary-purple);color:var(--primary-purple);}
        .main{padding:40px 80px;max-width:860px;margin:0 auto;width:100%;}
        .main h2{font-size:1.7rem;font-weight:800;text-align:center;margin-bottom:30px;}
        .profile-card{background:var(--card-bg);border:2px solid var(--primary-purple-border);border-radius:18px;padding:24px 28px;display:flex;align-items:center;gap:22px;margin-bottom:18px;box-shadow:0 6px 20px var(--nav-shadow);}
        .doc-img{width:90px;height:90px;border-radius:12px;background:var(--primary-purple-bg);display:flex;align-items:center;justify-content:center;font-size:3.2rem;flex-shrink:0;overflow:hidden;}
        .profile-info h3{font-size:1.6rem;font-weight:900;margin-bottom:6px;}
        .profile-info .spec{font-size:.9rem;color:var(--primary-purple);font-weight:800;background:var(--primary-purple-bg);display:inline-block;padding:4px 12px;border-radius:8px;margin-bottom:6px;}
        .profile-info .rating{font-size:.95rem;display:flex;align-items:center;gap:5px;margin-bottom:4px;color:var(--text-muted);}
        .profile-info .location{font-size:.95rem;color:var(--text-muted);margin-bottom:4px;}
        .profile-info .qualification{font-size:.9rem;color:var(--text-muted);font-style:italic;}
        .about-card{background:var(--card-bg);border:2px solid var(--primary-purple-border);border-radius:18px;padding:22px 28px;margin-bottom:18px;box-shadow:0 4px 15px var(--nav-shadow);}
        .about-card h4{font-weight:800;font-size:1.1rem;color:var(--primary-purple-border);margin-bottom:12px;}
        .about-card p{font-size:1rem;color:var(--text-muted);line-height:1.7;}
        .exp-card{background:var(--card-bg);border:2px solid var(--primary-purple-border);border-radius:18px;padding:24px 28px;box-shadow:0 4px 15px var(--nav-shadow);}
        .exp-card h4{font-weight:800;font-size:1.2rem;color:var(--primary-purple-border);margin-bottom:18px;}
        .slots{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;}
        .slot{border:2px solid var(--border-color);border-radius:10px;padding:12px 22px;font-size:.95rem;font-weight:800;background:var(--card-bg);cursor:pointer;transition:all .15s ease;color:var(--text-muted);}
        .slot:hover:not(:disabled){background:var(--primary-purple-bg);border-color:var(--primary-purple);color:var(--text-color);}
        .slot.active{background:var(--primary-purple);border-color:var(--primary-purple);color:#fffffftransform:scale(1.05);box-shadow:0 4px 12px var(--shadow-purple);}
        .slot.unavailable{background:#f4f4f4;border-color:#e0e0e0;color:var(--text-muted);cursor:not-allowed;text-decoration:none;opacity:0.6;}
        .book-btn{display:block;width:fit-content;margin:0 auto;background:var(--primary-purple);color:#ffffff;border:none;border-radius:999px;padding:14px 48px;font-family:'Nunito',sans-serif;font-weight:900;font-size:1.05rem;cursor:pointer;transition:all .2s;}
        .book-btn:hover{background:#6a20ee;transform:translateY(-2px);box-shadow:0 8px 20px var(--shadow-purple);}
        .back-row{margin-top:20px;display:flex;gap:10px;}
        .back-button{border:2px solid #a8a8a8;color:var(--text-muted);border-radius:999px;padding:7px 18px;font-weight:800;cursor:pointer;background:var(--card-bg);transition:all .2s;text-decoration:none;font-size:.9rem;}
        .back-button:hover{background:#f0f0f0;}
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
          <Link href="/patient/profile">PROFILE</Link>
          
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); router.push('/patient/login'); }}>👤 LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <div className="profile-card">
          <div className="doc-img">👨‍⚕️</div>
          <div className="profile-info">
            <h3>Dr. {doctor.name}</h3>
            <div className="spec">{doctor.specialization}</div>
            <div className="rating">⭐ {doctor.experience} years experience</div>
            <div className="location">📍 {doctor.location}</div>
            <div className="qualification">🎓 {doctor.qualification}</div>
          </div>
        </div>
        <div className="about-card">
          <h4>About Doctor</h4>
          <p>Dr. {doctor.name} is a highly experienced {doctor.specialization?.toLowerCase() || 'specialist'} helping patients with compassionate care and modern treatment plans.</p>
        </div>
        <div className="exp-card">
          <h4>Schedule Appointment:</h4>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '10px', color: '#444' }}>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} /* Prevent past booking locally */
              style={{
                border: '2px solid var(--primary-purple-border)',
                borderRadius: '10px',
                padding: '12px 18px',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '1rem',
                fontWeight: '700',
                color: '#444',
                outline: 'none',
                width: '100%',
                maxWidth: '250px'
              }}
            />
          </div>
          
          <div style={{ minHeight: '60px', marginBottom: '20px' }}>
            {!selectedDate ? (
              <p style={{ color: '#777', fontStyle: 'italic', padding: '10px 0' }}>Please select a date to view available slots.</p>
            ) : slotsLoading ? (
              <p style={{ color: 'var(--primary-purple)', fontWeight: 600, padding: '10px 0' }}>Checking doctor's calendar...</p>
            ) : isBlocked ? (
              <div style={{ background: '#fee', color: '#e74c3c', padding: '14px', borderRadius: '10px', fontWeight: 700, border: '1px solid #fcc' }}>
                🛑 Doctor is on leave or unavailable on this date.
              </div>
            ) : (
              <div className="slots">
                {allSlots.map((slot) => {
                  // A slot is unclickable (greyed out) if:
                  // 1. It is booked
                  // 2. Or, it wasn't added by the doctor for this specific day
                  const isBooked = bookedSlots.includes(slot);
                  const notAddedByDoctor = !addedSlots.includes(slot);
                  const isUnavailable = isBooked || notAddedByDoctor;
                  
                  let titleStr = "Select slot";
                  if (isBooked) titleStr = "Slot already booked by another patient";
                  else if (notAddedByDoctor) titleStr = "Doctor has not allocated this time slot";

                  return (
                    <button
                      key={slot}
                      disabled={isUnavailable}
                      className={`slot ${selectedSlot === slot ? 'active' : ''} ${isUnavailable ? 'unavailable' : ''}`}
                      onClick={() => !isUnavailable && setSelectedSlot(slot)}
                      title={titleStr}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button className="book-btn" onClick={async () => {
            if (!selectedDate || !selectedSlot) {
              alert('Please select date and time');
              return;
            }
            try {
              const { default: api } = await import('../../../services/api');
              const res = await api.post('/appointments', {
                doctorId: params.id,
                date: selectedDate,
                timeSlot: selectedSlot,
              });
              if (res.status === 201) {
                alert('Appointment booked! Waiting for doctor to accept.');
                router.push('/patient/dashboard#appointments');
              }
            } catch (err: any) {
              alert(err.response?.data?.message || 'Failed to book');
            }
          }}>BOOK APPOINTMENT</button>
        </div>
        <div className="back-row">
          <button className="back-button" onClick={() => router.back()}>← Back</button>
          <Link className="back-button" href="/patient/dashboard">Patient Dashboard</Link>
        </div>
      </div>
    </div>
  );
}