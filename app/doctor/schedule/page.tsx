'use client';

import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';

export default function DoctorSchedule() {
  const slots = ['10:00 AM', '11:00 AM', '12:30 PM', '01:30 PM', '03:00 PM', '04:00 PM'];

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
        .main{padding:36px 60px;max-width:900px;width:100%;}
        .main h2{font-size:1.6rem;font-weight:800;font-style:italic;text-align:center;margin-bottom:28px;}
        .slot-box{border:2px solid #a8e6b8;border-radius:20px;padding:30px 36px;background:#fff;}
        .box-title{display:flex;align-items:center;gap:12px;margin-bottom:22px;}
        .box-title span{font-size:1.5rem;}
        .box-title h3{font-size:1.1rem;font-weight:800;font-style:italic;}
        .slots{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:28px;}
        .slot{border:1.8px solid #bbb;border-radius:12px;padding:10px 22px;font-size:.9rem;font-weight:700;background:#fff;cursor:pointer;transition:background .15s;}
        .slot:hover,.slot.active{background:#c6f0d0;border-color:#3ab55a;}
        .divider{border:none;border-top:1.5px solid #d0d0d0;margin:18px 0;}
        .actions{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;}
        .action-btn{border:1.8px solid #bbb;border-radius:12px;padding:11px 20px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;background:#fff;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .15s;}
        .action-btn:hover{background:#f0f0f0;}
        .block-dates{margin-top:18px;}
        .block-dates label{font-weight:800;font-size:.95rem;display:block;margin-bottom:12px;}
        .block-dates input{width:100%;border:1.8px solid #bbb;border-radius:999px;padding:12px 22px;font-family:'Nunito',sans-serif;font-size:.9rem;outline:none;}
        .block-dates input:focus{border-color:#3ab55a;}
        .block-btn{display:block;width:fit-content;margin:18px auto 0;background:#2e9e48;color:#fff;border:none;border-radius:999px;padding:13px 44px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;font-style:italic;cursor:pointer;}
        .block-btn:hover{background:#237a38;}
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
        <h2>Manage Time Slot</h2>
        <div className="slot-box">
          <div className="box-title">
            <span>📅</span>
            <h3>Today's Available Slots:</h3>
          </div>
          <div className="slots">
            {slots.map((s) => <button key={s} className="slot">{s}</button>)}
          </div>
          <hr className="divider" />
          <div className="actions">
            <button className="action-btn">＋ Add New Slot</button>
            <button className="action-btn">— Remove Slot</button>
            <button className="action-btn">📅 Block Slot</button>
          </div>
          <hr className="divider" />
          <div className="block-dates">
            <label>Block Dates <span style={{ fontWeight: 400 }}>(Vacation or Unavailable Days):</span></label>
            <input type="text" placeholder="Enter date range...." />
          </div>
          <button className="block-btn">Block Date</button>
        </div>
      </div>
    </div>
  );
}