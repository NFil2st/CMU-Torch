<div align="center">
  <img src="CMUtorch/assets/Logo-README.png" width="1000" alt="Logo" />
</div>

# 🩺 Health App

A mobile health tracking application built with **React Native**, **Node.js**, and **Supabase**.  
The app helps users monitor their health data, track daily activities, and visualize wellness progress in real-time.

---

## Tech Stack

| Layer | Technology | Description |
|-------|-------------|--------------|
| Frontend | **React Native (Expo)** | Cross-platform mobile app for Android & iOS |
| Backend | **Node.js + Express.js** | REST API for managing health data |
| Database | **Supabase (PostgreSQL)** | Cloud database for storing user and activity records |
| Authentication | **Supabase Auth** | Secure user sign-in and session management |

---

## Features

- Daily Mood Tracker & Wellness Summary
- Mood Based Sports & Fitness Recommendations
- Mood Food & Eatery Recommendations
- Mantal take care
- Ranking top 5 each category
- Clean & minimal UI built with React Native components  

---

## Project Structure

```
health-app/
├── backend/               # Node.js API server
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── models/
├── app/                   # React Native (Expo) project
│   ├── App.js
│   ├── components/
│   ├── screens/
│   └── services/
└── README.md
```

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/bookbento/Health-app
cd health-app
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
npm install react-native-android-widget
npx pod-install
```

> Create a `.env` file:
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
PORT=4000
```

### 3. Frontend Setup
```bash
cd app
npm install
npx expo start
```

> Make sure the backend server is running before launching the app.

---

## Environment Variables

| Variable | Description |
|-----------|--------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase public API key |
| `PORT` | Backend server port |

---

## API Overview

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/users/register` | POST | Register new user |
| `/api/users/login` | POST | User login |
| `/api/health-data` | GET | Fetch user health data |
| `/api/health-data` | POST | Add new record |

---

## Contributors

| Name | Role |
|------|------|
| Bookbik | Frontend Developer (React Native) |
| First | Backend Developer (Node.js / Supabase) |
| Aun | PM  (Manange people in group) |
| Sky | UX/UI (UI and Interface) |
---

## Future Plans

- Integration with wearable devices (Fitbit, Apple Watch)
- AI-Detect food of user  
- Data visualization with charts
- Push notifications for reminders

---

## License
This project is licensed under the **MIT License** — feel free to use and modify.  
Made with by the **Docter Gentleman Team**
