# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





# Sejuk360 Service WebApp – Programmer Assessment

## 🔧 What I Built

This project is a technician workflow management system for **Sejuk Sejuk Service Sdn Bhd**, developed as part of a programmer assessment. It aims to digitize the full service workflow of air-conditioner installation, servicing, and repair across five branches with over 20 technician teams.

The WebApp includes:

- ✅ **Admin Portal** – Create and assign jobs to technicians
- ✅ **Technician Portal** – View assigned jobs, upload work completion data
- ✅ **Job Completion Form** – File upload, final amount calculation, job status updates
- ✅ **WhatsApp Notification** – Triggered on job assignment and completion
- ✅ **KPI Dashboard** – Visual summary of jobs and earnings per technician (Bonus)
- ✅ **Authentication** – Login, session persistence using Firebase Auth
- ✅ **Protected Routes** – Role-based access control (admin vs technician)

---

## 🛠 Tech Used

| Layer | Stack |
|-------|-------|
| **Frontend** | React.js (Vite), Tailwind CSS |
| **Backend** | Firebase Firestore (NoSQL), Firebase Storage |
| **Auth** | Firebase Authentication |
| **File Upload** | Firebase Storage (images, PDF, video) |
| **Notification** | WhatsApp via deep link URL |
| **Deployment** | Firebase Hosting |
| **Routing & Protection** | React Router + role-based `ProtectedRoute` |

---

## 🤔 Challenges, Assumptions & Ideas

### 🔹 Challenges:
- Ensuring login session persistence across route changes and reloads
- Managing real-time sync between Firebase Auth and local storage
- Implementing file upload with Firebase Storage and preview
- Role-based access control between admin and technician

### 🔹 Assumptions:
- Admin users are identified via emails starting with `admin@...`
- WhatsApp notifications are sent using mock or demo phone numbers
- Each technician has a corresponding phone number stored in Firestore
- Job data structure includes `quotedPrice`, `extraCharges`, and `finalAmount`

### 💡 Ideas:
- Introduced modular component structure for future scalability
- Added role-aware routing using dynamic `<ProtectedRoute role="...">`
- KPI dashboard can be extended to include filters (by date, region, etc.)

---

## ✅ Logic (If Only One Module Was Completed)

> I completed all the main modules and the bonus dashboard. If I had completed only one:

### Module: Technician Job Completion
- Technician sees their assigned jobs
- Selects a job and fills a form with:
  - Work done
  - Extra charges
  - Upload (images, PDF, video)
  - Remarks and auto-calculated final amount
- Upon submission:
  - Files are uploaded to Firebase Storage
  - Job is updated in Firestore with `"status": "Job Done"`
  - WhatsApp message is sent to the customer

This module highlights my strengths in:
- Frontend form handling
- File upload integration
- Real-world backend logic (updating job records, generating notifications)

---

## 🚀 Live Demo

🔗 [https://sejuk360-125cc.web.app](https://sejuk360-125cc.web.app)

---


