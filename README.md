# 🏥 Online Appointment Booking System

A full-stack healthcare appointment scheduling platform that enables patients to book appointments and doctors to manage their availability — with real-time slot validation, secure authentication, and a clean responsive UI.

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login with bcrypt password hashing for patients and doctors
- 📅 **Appointment Booking** — Patients can browse doctors, view availability, and book slots instantly
- 🩺 **Doctor Dashboard** — Doctors can manage schedules, view upcoming appointments, and update availability
- ⚡ **Real-time Slot Validation** — Prevents double bookings with live availability checks against MongoDB
- 📱 **Responsive UI** — Clean, mobile-friendly interface built with Next.js, React, and Tailwind CSS
- 🔒 **Role-based Access** — Separate patient and doctor flows with protected routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT, bcrypt |
| Language | TypeScript (73%), JavaScript (18%), CSS |

---

## 📁 Project Structure

```
Online_Appointment_Booking_System/
├── frontend/          # Next.js + React app
│   ├── components/    # Reusable UI components
│   ├── pages/         # Next.js page routes
│   └── styles/        # Tailwind CSS config
├── backend/           # Node.js + Express API
│   ├── routes/        # API route handlers
│   ├── models/        # MongoDB schemas
│   ├── middleware/     # Auth middleware (JWT)
│   └── controllers/   # Business logic
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/mentheshreya/Online_Appointment_Booking_System.git
cd Online_Appointment_Booking_System
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:

```bash
npm run dev
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register patient or doctor |
| POST | `/api/auth/login` | Login and receive JWT token |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/appointments` | Get all appointments for user |
| POST | `/api/appointments/book` | Book a new appointment |
| PUT | `/api/appointments/:id` | Update appointment status |
| DELETE | `/api/appointments/:id` | Cancel an appointment |

### Doctors
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | List all available doctors |
| GET | `/api/doctors/:id/slots` | Get available slots for a doctor |
| PUT | `/api/doctors/availability` | Update doctor availability |

---

## 👥 Contributors

| Name | Role | GitHub |
|---|---|---|
| Shreya Menthe | Full-Stack Developer | [@mentheshreya](https://github.com/mentheshreya) |
| Shravani Kalapure | Full-Stack Developer | [@shravanikalapure](https://github.com/shravanikalapure) |

---

## 📄 License

This project is licensed under the MIT License.

---

> Built as part of a full-stack development project at Pimpri Chinchwad College of Engineering.
