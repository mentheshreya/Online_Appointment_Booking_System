'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useNotification } from '../../components/Notification';

export default function DoctorSchedule() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Entire schedule data loaded from backend
  const [dateSpecificSlots, setDateSpecificSlots] = useState<{date: string, slots: string[]}[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  
  const [newSlot, setNewSlot] = useState('');
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const fetchSchedule = async () => {
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
        setDateSpecificSlots(res.data.profile.dateSpecificSlots || []);
        setBlockedDates(res.data.profile.blockedDates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const saveSchedule = async (updatedDateSpecificSlots: typeof dateSpecificSlots, updatedBlockedDates: string[]) => {
    try {
      const { default: api } = await import('../../../services/api');
      await api.put('/doctors/schedule', { dateSpecificSlots: updatedDateSpecificSlots, blockedDates: updatedBlockedDates });
      addNotification('Schedule updated successfully', 'success');
      return true;
    } catch (err) {
      addNotification('Failed to update schedule', 'error');
      return false;
    }
  };

  const currentSlots = dateSpecificSlots.find(d => d.date === selectedDate)?.slots || [];

  const handleAddSlot = async () => {
    if (!selectedDate) return addNotification('Please select a date first', 'error');
    if (!newSlot.trim()) return;
    if (currentSlots.includes(newSlot.trim())) {
      addNotification('Time slot already exists for this date', 'error');
      return;
    }
    
    const newSlotList = [...currentSlots, newSlot.trim()].sort((a, b) => a.localeCompare(b));
    let updatedDS = [...dateSpecificSlots];
    const existingIndex = updatedDS.findIndex(d => d.date === selectedDate);
    
    if (existingIndex >= 0) {
      updatedDS[existingIndex] = { ...updatedDS[existingIndex], slots: newSlotList };
    } else {
      updatedDS.push({ date: selectedDate, slots: newSlotList });
    }
    
    setDateSpecificSlots(updatedDS);
    setNewSlot('');
    await saveSchedule(updatedDS, blockedDates);
  };

  const handleRemoveSlot = async (slotToRemove: string) => {
    const newSlotList = currentSlots.filter(s => s !== slotToRemove);
    let updatedDS = [...dateSpecificSlots];
    const existingIndex = updatedDS.findIndex(d => d.date === selectedDate);
    
    if (existingIndex >= 0) {
      updatedDS[existingIndex] = { ...updatedDS[existingIndex], slots: newSlotList };
    }
    
    setDateSpecificSlots(updatedDS);
    await saveSchedule(updatedDS, blockedDates);
  };

  const handleBlockDate = async () => {
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      addNotification('Date is already blocked', 'error');
      return;
    }
    const updatedBlockedDates = [...blockedDates, newBlockedDate].sort();
    setBlockedDates(updatedBlockedDates);
    setNewBlockedDate('');
    await saveSchedule(dateSpecificSlots, updatedBlockedDates);
  };

  const handleUnblockDate = async (dateToRemove: string) => {
    const updatedBlockedDates = blockedDates.filter(d => d !== dateToRemove);
    setBlockedDates(updatedBlockedDates);
    await saveSchedule(dateSpecificSlots, updatedBlockedDates);
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
        .nav-links a{text-decoration:none;color:var(--text-color);font-weight:700;font-size:.95rem;letter-spacing:.5px;transition:color .2s;}
        .nav-links a:hover, .nav-links a.active{color:var(--primary-green);}
        .logout-btn{background:var(--card-bg);border:2px solid #222;border-radius:999px;padding:9px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .2s;}
        .logout-btn:hover{background:var(--card-hover);}
        .main{padding:36px 60px;max-width:900px;width:100%;margin:0 auto;}
        .main h2{font-size:1.6rem;font-weight:800;font-style:italic;margin-bottom:28px;}
        .slot-box{border:2px solid var(--primary-green-border);border-radius:20px;padding:30px 36px;background:var(--card-bg);box-shadow:0 8px 24px var(--nav-shadow);}
        .box-title{display:flex;align-items:center;gap:12px;margin-bottom:22px;}
        .box-title span{font-size:1.5rem;}
        .box-title h3{font-size:1.1rem;font-weight:800;font-style:italic;}
        .slots{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:28px;}
        .slot{border:1.8px solid var(--border-color);border-radius:12px;padding:10px 22px;font-size:.9rem;font-weight:700;background:var(--card-bg);cursor:default;display:flex;align-items:center;gap:10px;}
        .slot .delete-btn{background:#fee;color:#e74c3c;border:none;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.8rem;transition:all .2s;}
        .slot .delete-btn:hover{background:#e74c3c;color:#ffffff}
        .divider{border:none;border-top:1.5px solid #eaeaea;margin:24px 0;}
        .actions{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;align-items:flex-end;}
        .action-group{display:flex;flex-direction:column;gap:6px;}
        .action-group label{font-size:.85rem;font-weight:800;color:var(--text-muted);}
        .action-input{border:1.8px solid var(--primary-green-border);border-radius:12px;padding:11px 20px;font-family:'Nunito',sans-serif;font-size:.9rem;outline:none;flex:1;min-width:200px;}
        .action-input:focus{border-color:var(--primary-green);}
        .action-btn{background:var(--primary-green-bg);color:var(--primary-green);border:none;border-radius:12px;padding:11px 24px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s;height:43px;}
        .action-btn:hover{background:var(--primary-green);color:#ffffff}
        .block-dates label{font-weight:800;font-size:.95rem;display:block;margin-bottom:12px;}
        .blocked-list{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;}
        .blocked-badge{background:#fee;border:1px solid #fcc;color:#e74c3c;padding:6px 14px;border-radius:999px;font-size:.85rem;font-weight:700;display:flex;align-items:center;gap:8px;}
        .blocked-badge button{background:none;border:none;color:#e74c3c;cursor:pointer;font-weight:900;font-size:1rem;}
      `}</style>
      <nav>
        <div className="logo-circle">
          <span className="cross">➕</span>
          <span className="name">MEDISLOT</span>
          <span className="sub">HEALTH CARE SOLUTION</span>
        </div>
        <div className="nav-links">
          <Link href="/doctor/dashboard">DASHBOARD</Link>
          <Link href="/doctor/schedule" className="active">SCHEDULE</Link>
          <Link href="/doctor/profile">PROFILE</Link>
          
          <button className="logout-btn" onClick={handleLogout}>👤 LOGOUT</button>
        </div>
      </nav>
      <div className="main">
        <h2>Manage Schedule & Time Slots</h2>
        <div className="slot-box">
          
          <div className="actions" style={{marginBottom: '28px'}}>
            <div className="action-group">
               <label>Step 1: Select Date to configure</label>
               <input 
                  type="date" 
                  className="action-input"
                  style={{ borderColor: '#222' }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
               />
            </div>
          </div>

          <div className="box-title">
            <span>📅</span>
            <h3>Slots Confirmed for {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Date'}:</h3>
          </div>
          
          <div className="slots">
            {loading ? <p>Loading schedule...</p> : !selectedDate ? <p style={{color: '#999'}}>Please select a date above.</p> : currentSlots.length === 0 ? <p style={{color: '#999'}}>No slots added for this date. Add below.</p> : currentSlots.map((s) => (
              <div key={s} className="slot">
                {s}
                <button className="delete-btn" title="Remove slot" onClick={() => handleRemoveSlot(s)}>×</button>
              </div>
            ))}
          </div>

          <div className="actions">
            <div className="action-group">
               <label>Add specifically into {selectedDate}</label>
               <input 
                 type="time" 
                 className="action-input"
                 value={newSlot}
                 onChange={(e) => setNewSlot(e.target.value)}
               />
            </div>
            <button className="action-btn" onClick={handleAddSlot}>＋ Add Slot to Date</button>
          </div>
          
          <hr className="divider" />
          
          <div className="block-dates">
            <div className="box-title">
              <span>🏖️</span>
              <h3>Block Specific Dates (Vacation/Leave):</h3>
            </div>
            
            <div className="actions">
              <div className="action-group">
                <label>Date to completely disable</label>
                <input 
                  type="date" 
                  className="action-input"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <button className="action-btn" style={{background: '#fee', color: '#e74c3c'}} onClick={handleBlockDate}>📅 Block This Date</button>
            </div>
            
            {blockedDates.length > 0 && (
              <div className="blocked-list">
                {blockedDates.map(d => (
                  <div key={d} className="blocked-badge">
                    {new Date(d).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                    <button onClick={() => handleUnblockDate(d)}>×</button>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}