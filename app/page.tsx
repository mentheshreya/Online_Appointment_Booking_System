import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav>
        <div className="logo-circle">
          <span className="cross">➕</span>
          <span className="name">MEDISLOT</span>
          <span className="sub">HEALTH CARE SOLUTION</span>
        </div>
        <ThemeToggle />
        <button className="nav-btn">LOGIN | SIGN UP</button>
      </nav>
      <div className="hero">
        <h1>Welcome to MediSlot 🏥</h1>
        <p>Please select how you'd like to continue</p>
        <div className="cards">
          <Link href="/patient/login" className="card patient">
            <div className="icon-wrap">🧑‍⚕️</div>
            <h2>I'm a Patient</h2>
            <p>Book & manage your<br />appointments</p>
          </Link>
          <Link href="/doctor/login" className="card doctor">
            <div className="icon-wrap">👨‍⚕️</div>
            <h2>I'm a Doctor</h2>
            <p>Manage your schedule<br />& patients</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
