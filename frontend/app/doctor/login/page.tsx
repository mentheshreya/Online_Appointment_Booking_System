'use client';

import { useState } from 'react';
import Link from 'next/link';

import Notification, { useNotification } from '../../components/Notification';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addNotification('Please fill all fields', 'error');
      return;
    }
    if (!email.includes('@')) {
      addNotification('Invalid email format', 'error');
      return;
    }
    try {
      const { default: api } = await import('../../../services/api');
      const res = await api.post('/auth/login', { email, password });
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        addNotification('Login successful!', 'success');
        setTimeout(() => window.location.href = '/doctor/dashboard', 1000);
      } else {
        addNotification('Login failed', 'error');
      }
    } catch (err: any) {
      addNotification(err.response?.data?.message || 'Login failed', 'error');
    }
  };

  return (
    <div>
      <style jsx>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Nunito',sans-serif;background:var(--card-bg);min-height:100vh;display:flex;flex-direction:column;}
        nav{background:var(--primary-green-border);border-radius:0 0 28px 28px;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;}
        .logo-circle{width:70px;height:70px;background:var(--card-bg);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid var(--border-color);}
        .logo-circle .cross{font-size:26px;line-height:1.1;}
        .logo-circle .name{font-size:7.5px;font-weight:900;color:var(--primary-purple-border);letter-spacing:.8px;}
        .logo-circle .sub{font-size:4.5px;color:var(--text-muted);letter-spacing:.3px;text-align:center;padding:0 4px;}
        .nav-btn{background:var(--card-bg);border:2px solid #222;border-radius:999px;padding:10px 26px;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;cursor:pointer;}
        .main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;}
        h1{font-size:2.1rem;font-weight:800;font-style:italic;margin-bottom:8px;text-align:center;}
        .sub-text{font-size:1rem;color:var(--text-muted);margin-bottom:36px;text-align:center;}
        .form-box{background:#dff5e6;border:2px solid var(--primary-green-border);border-radius:22px;padding:38px 44px;width:100%;max-width:480px;}
        .field{margin-bottom:22px;}
        .field label{display:block;font-weight:700;font-size:.95rem;margin-bottom:8px;}
        .input-wrap{position:relative;display:flex;align-items:center;background:var(--card-bg);border:1.8px solid #c0dfc9;border-radius:999px;padding:12px 18px;gap:10px;}
        .input-wrap input{border:none;outline:none;font-family:'Nunito',sans-serif;font-size:.95rem;flex:1;background:transparent;}
        .input-wrap .icon{font-size:1rem;color:var(--text-muted);}
        .eye{cursor:pointer;font-size:1rem;color:var(--text-muted);margin-left:auto;}
        .btn-login{display:block;width:100%;background:var(--card-bg);border:1.8px solid var(--primary-green-border);border-radius:999px;padding:13px;font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;cursor:pointer;text-align:center;margin-top:10px;transition:background .15s;text-decoration:none;color:var(--text-color);}
        .btn-login:hover{background:var(--primary-green-bg);}
        .forgot{display:inline-block;font-size:.88rem;font-weight:700;text-decoration:underline;color:var(--text-color);margin-top:14px;cursor:pointer;}
        .alt-text{margin-top:14px;text-align:center;font-size:.92rem;color:var(--text-muted);}
        .alt-text a{color:var(--primary-purple-border);font-weight:800;text-decoration:none;}
      `}</style>
      <nav>
        <div className="logo-circle">
          <span className="cross">➕</span>
          <span className="name">MEDISLOT</span>
          <span className="sub">HEALTH CARE SOLUTION</span>
        </div>
        
        <button className="nav-btn">LOGIN | SIGN UP</button>
      </nav>
      <div className="main">
        <h1>Doctor Login</h1>
        <p className="sub-text">Manage your Appointments and Patients!</p>
        <form onSubmit={handleSubmit} className="form-box">
          <div className="field">
            <label>Email/Username</label>
            <div className="input-wrap">
              <span className="icon">✉️</span>
              <input type="text" placeholder="Enter email/username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <span className="icon">🔒</span>
              <input type={showPassword ? 'text' : 'password'} id="pwd" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span className="eye" onClick={() => setShowPassword(!showPassword)}>👁️</span>
            </div>
          </div>
          <button type="submit" className="btn-login">LOGIN</button>
          <br />
          <a className="forgot" href="#">Forgot Password?</a>
          <p className="alt-text">New here? <Link href="/signup?role=doctor">Sign Up</Link></p>
        </form>
      </div>
      {notifications.map(n => (
        <Notification key={n.id} message={n.message} type={n.type} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
}