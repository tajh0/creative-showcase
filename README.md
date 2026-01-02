
# Creative Showcase Web App

A modern **React + Vite** based creative web application.
---

## Features

- Built with **React + TypeScript + Vite**
- Create Profile
- Upload Images
- Masonry-style image grid
- Dynamic featured images (random on every refresh)
- Modular component architecture

## Netlify link
https://naimulscreativeshowcase.netlify.app/

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
### Run the Project
```bash
cd creative-showcase
npm install
npm run dev
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

