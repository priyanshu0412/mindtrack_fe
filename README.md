# 🌐 Mindtrack Frontend

This is the frontend for **Mindtrack** – a productivity-focused web app that combines a To-Do list and a Personal Diary. Built with **Next.js** and **Tailwind CSS**, Mindtrack delivers a fast, modern, and secure user interface.

---

## 🚀 Features

- 🧠 **User-friendly UI** for To-Do and Diary management
- 🔐 **Authentication pages** (Signup/Login) integrated with the backend
- 📋 **Add, update, and delete tasks**
- 📖 **Write, edit, and delete diary entries**
- 🧭 **Protected Routes** (accessible only after login)
- 🎨 **Tailwind CSS** for modern, responsive styling
- 🍪 **Auth token stored in HttpOnly cookies** for secure session persistence

---

## 🧩 Tech Stack

- **Frontend Framework:** Next.js (React-based)
- **Styling:** Tailwind CSS
- **State Management:** useState, useEffect (Redux/Context if used)
- **Authentication:** JWT from backend stored in HttpOnly Cookies
- **API Calls:** Axios

---

## 📁 Folder Structure

```
mindtrack-fe/
├── components/        # Reusable UI components
├── pages/             # Next.js routing pages
│   ├── index.js       # Landing Page
│   ├── login.js       # Login Page
│   ├── signup.js      # Signup Page
│   ├── dashboard.js   # Main Dashboard (To-Do + Diary)
├── styles/            # Tailwind/global styles
├── utils/             # Axios config, helper functions
├── public/            # Static files & images
├── .env.local         # Environment variables
├── tailwind.config.js # Tailwind config
├── next.config.js     # Next.js config
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/priyanshu0412/mindtrack_fe.git
cd mindtrack_fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local` file

```
NEXT_PUBLIC_BE_URL=http://localhost:5000
```
> ⚠️ Replace with your actual backend URL in production.

### 4. Run the development server

```bash
npm run dev
```
Frontend will be live at [http://localhost:3000](http://localhost:3000)

---

## 🔒 Authentication Flow

- On successful login/signup, the backend returns a JWT token (stored in an HttpOnly cookie).
- The frontend checks auth status using cookies.
- Protected routes are conditionally rendered based on authentication state.

---

## 🧑‍💻 Author

**Priyanshu Agrawal**  
MERN Stack Developer  
GitHub: [@priyanshu0412](https://github.com/priyanshu0412)
