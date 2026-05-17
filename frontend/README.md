# AgriPool Frontend - React Application

This is the React-based frontend for the AgriPool logistics platform. It is built using Vite for high-performance development and features a custom-built, premium design system.

## 🚀 Key Technologies
- **React 18**
- **Vite** (Build Tool)
- **React Router 6** (Routing)
- **Axios** (API Communication)
- **Lucide-React** (Iconography)
- **Framer Motion** (Animations)

## 📁 Directory Structure
- `/src/pages`: Contains all role-based dashboards (Farmer, Driver, Admin).
- `/src/components`: Reusable UI components.
- `/src/services`: API service layer and Axios configuration.
- `/src/styles`: Global CSS variables and design tokens.

## 🛠️ Development
To start the development server:
```bash
npm run dev
```

## 🔒 Authentication Flow
The frontend uses **Laravel Sanctum** stateful authentication. It automatically handles CSRF cookies and session persistence. All API calls include `withCredentials: true`.

---

For the full project documentation, please refer to the [Root README](../README.md).
