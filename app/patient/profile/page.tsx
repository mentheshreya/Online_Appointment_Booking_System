'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import { useNotification } from '../../components/Notification';

export default function PatientProfile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFormData({ name: data.name, email: data.email, phone: data.phone });
        }
      } catch (error) {
        addNotification('Failed to load profile', 'error');
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditing(false);
        addNotification('Profile updated successfully', 'success');
      } else {
        addNotification('Failed to update profile', 'error');
      }
    } catch (error) {
      addNotification('Failed to update profile', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/patient/login';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <nav className="bg-purple-200 rounded-bl-3xl rounded-br-3xl p-4 px-9 flex items-center justify-between">
        <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center border-2 border-gray-300 flex-shrink-0">
          <span className="text-2xl leading-tight">➕</span>
          <span className="text-xs font-black text-purple-800 tracking-wider">MEDISLOT</span>
          <span className="text-[10px] text-gray-500 tracking-wide text-center px-1">HEALTH CARE SOLUTION</span>
        </div>
        <div className="flex items-center gap-9">
          <Link href="/patient/dashboard" className="no-underline text-gray-800 font-bold text-sm tracking-wide">HOME</Link>
          <Link href="#" className="no-underline text-gray-800 font-bold text-sm tracking-wide">MY APPOINTMENTS</Link>
          <Link href="/patient/profile" className="no-underline text-gray-800 font-bold text-sm tracking-wide">PROFILE</Link>
          <ThemeToggle />
          <button className="bg-white border-2 border-gray-800 rounded-full py-2 px-5 font-bold text-sm cursor-pointer flex items-center gap-2" onClick={handleLogout}>👤 LOGOUT</button>
        </div>
      </nav>
      <div className="p-10 px-12">
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 flex items-center gap-8 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-5xl flex-shrink-0">👤</div>
          <div className="flex-1">
            {isEditing ? (
              <>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="block mb-2 p-2 border rounded" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="block mb-2 p-2 border rounded" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="block mb-2 p-2 border rounded" />
                <button className="bg-purple-600 text-white border-none rounded-full py-2 px-6 font-bold text-sm cursor-pointer mr-2" onClick={handleSave}>Save</button>
                <button className="bg-gray-400 text-white border-none rounded-full py-2 px-6 font-bold text-sm cursor-pointer" onClick={handleEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold mb-2">{user.name}</h2>
                <p className="text-base text-gray-600 mb-1">Email: {user.email}</p>
                <p className="text-base text-gray-600 mb-1">Phone: {user.phone}</p>
                <p className="text-base text-gray-600 mb-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <input type="file" accept="image/*" className="mt-2" />
                <button className="bg-purple-600 text-white border-none rounded-full py-2 px-6 font-bold text-sm cursor-pointer mt-2 hover:bg-purple-700" onClick={handleEdit}>Edit Profile</button>
              </>
            )}
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 mb-5">
          <h3 className="text-xl font-extrabold mb-4">Appointment History</h3>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div>
              <div className="font-semibold">March 15, 2024</div>
              <div className="text-sm text-gray-600">Dr. Rahul Mehta - Cardiologist</div>
            </div>
            <div className="bg-green-300 text-white rounded-full py-1 px-3 text-xs font-bold">Completed</div>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold">February 20, 2024</div>
              <div className="text-sm text-gray-600">Dr. Shravani Kalapure - Dentist</div>
            </div>
            <div className="bg-green-300 text-white rounded-full py-1 px-3 text-xs font-bold">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}