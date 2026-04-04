# MediSlot - Online Appointment Booking System

A full-stack React application built with Next.js for booking medical appointments between patients and doctors. Features authentication, appointment management, and MongoDB integration.

## Features

- Patient and Doctor login/registration
- Patient dashboard to search and book doctors
- Doctor dashboard to manage appointments and schedule
- Responsive design with modern UI
- MongoDB backend with JWT authentication

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/medislot
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. Start MongoDB service

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `lib/` - Database models and utilities
- `components/` - Reusable React components

## API Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
