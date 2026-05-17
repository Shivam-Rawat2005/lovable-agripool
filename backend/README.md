# AgriPool Backend - Laravel 11 API

This is the Laravel-based backend for the AgriPool logistics platform. It manages authentication, shipment pooling logic, and data persistence using MongoDB.

## 🚀 Key Technologies
- **Laravel 11**
- **MongoDB** (Primary Database)
- **Laravel Sanctum** (Stateful SPA Authentication)
- **CORS Configured** for React (Vite)

## 📁 Key Controllers
- `AuthController`: Handles registration, login, and session management.
- `TransportRequestController`: Manages farmer shipment requests.
- `PoolController`: Orchestrates the intelligent pooling and matching logic.
- `VehicleController`: Handles driver fleet registration.
- `TripController`: Manages the lifecycle of a delivery (Acceptance to Completion).
- `DashboardController`: Provides optimized stats for the 3 user roles.

## ⚙️ Configuration
The backend is configured to work with a MongoDB instance. Ensure your `.env` contains:
```env
DB_CONNECTION=mongodb
DB_URI=mongodb://127.0.0.1:27017/lovableagripool
```

## 🛠️ API Routes
All routes are protected by the `auth:sanctum` middleware except for `/login` and `/register`.

---

For the full project documentation, please refer to the [Root README](../README.md).
