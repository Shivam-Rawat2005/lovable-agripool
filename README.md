# 🌾 AgriPool - Intelligent Agricultural Logistics

AgriPool is a full-stack platform designed to solve the "Empty Truck" problem in agriculture. By connecting farmers with drivers and intelligently grouping shipments along shared routes, it reduces costs for farmers and maximizes earnings for drivers.

## 🏗️ System Architecture
- **Frontend (React)**: A role-specific SPA providing distinct interfaces for Farmers, Drivers, and Admins.
- **Backend (Laravel 11)**: A secure RESTful API orchestrating logistics logic and stateful authentication.
- **Database (MongoDB)**: A flexible NoSQL layer used for dynamic shipment schemas and rapid scaling.

## 🚀 Key Features
- **👨‍🌾 Farmer Portal**: Dynamic cost estimation, intelligent pool discovery, and real-time shipment tracking.
- **🚛 Driver Portal**: Fleet management, job marketplace (Requests & Pools), and automated earnings calculation.
- **🛡️ Admin Command Center**: Real-time platform analytics, user management, and logistics oversight.

## 🛠️ Tech Stack
- **Frontend**: React 18 (Vite), Framer Motion (Animations), Lucide (Icons), and Axios.
- **Backend**: Laravel 11 with **Sanctum** for secure, cookie-based session management.
- **Database**: MongoDB via the `laravel-mongodb` Eloquent driver.
- **Integration**: Fully configured CORS and stability shields for seamless local development.

## 🚦 Getting Started

1. **Backend**:
   ```bash
   cd backend && composer install
   cp .env.example .env && php artisan key:generate
   # Set DB_CONNECTION=mongodb and DB_URI in .env
   php artisan serve --port=8000
   ```
2. **Frontend**:
   ```bash
   cd frontend && npm install
   npm run dev
   ```

## 🔑 Demo Access
- **Admin**: `admin@gmail.com` / `1234567890`
- **User Portals**: Create a new account via the registration page to test Farmer/Driver flows.

---
*Developed with ❤️ to empower the agricultural community.*
