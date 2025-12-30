
# Creative Showcase Web App

A modern **React + Vite** based creative portfolio web application.

This project currently runs as a **frontend-only demo**, using **dynamic dummy images**, and is structured to easily scale into a full-stack application.

---

## Features

- Built with **React + TypeScript + Vite**
- Masonry-style image grid
- Dynamic featured images (random on every refresh)
- Modular component architecture

## 📁 Project Structure

```
creative-showcase/
├── components/
├── pages/
├── services/
├── backend/
│   ├── config/db.js
│   ├── models/Image.js
│   └── server.js
├── App.tsx
└── README.md
```

---

### Start Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs at:
```
http://localhost:5000
```

---

## 🌱 Environment Variables

### Frontend
No environment variables required.

### Backend (`backend/.env`)
```
MONGODB_URI=mongodb://127.0.0.1:27017/creative-showcase
```

---

## 🛠 Tech Stack

- React
- TypeScript
- Vite
- Express.js
- MongoDB (Mongoose)


## 👨‍💻 Author

Naimul Hossain

