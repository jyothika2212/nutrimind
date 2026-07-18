# Deployment Guide

This document describes how to deploy **NutriMind AI** both locally and in production cloud environments.

---

## 1. Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (Local instance or MongoDB Atlas account)

### Backend Local Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory using the variables in the [Environment Variables](#environment-variables) section.
4. Run the database seed script to load default templates, test accounts, and food items:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   *Server will run at: `http://localhost:5000` (or the configured `PORT`)*

### Frontend Local Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory with:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Start the frontend client dev server:
   ```bash
   npm run dev
   ```
   *Frontend will run at: `http://localhost:3000`*

---

## 2. Running via Docker

The platform is containerized using Docker and orchestrated using Docker Compose.

### Running the Whole Stack (Frontend, Backend)
In the repository root directory, run:
```bash
docker-compose up --build
```
Once the containers build and launch successfully:
* **Frontend Web App:** `http://localhost:3010` (or configured port)
* **Backend REST API:** `http://localhost:5010` (or configured port)

> [!NOTE]
> The `docker-compose.yml` configuration launches a Redis container alongside the frontend and backend services. However, this Redis service is **not currently used by the application logic** and remains idle.

---

## 3. Production Deployment

### Database: MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and whitelist the IP address of your hosting servers (or allow access from anywhere `0.0.0.0/0` if necessary).
3. Go to **Database Access** and create a user with read/write privileges.
4. Copy the connection URI string (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/nutrimind?retryWrites=true&w=majority`).

### Backend Deployment: Render (Web Service)
1. Sign up on [Render](https://render.com/) and connect your GitHub repository.
2. Select **New** > **Web Service**.
3. Choose your NutriMind repository.
4. Configure the service settings:
   * **Name:** `nutrimind-backend`
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start`
5. In the **Environment** tab, define the required variables (see [Environment Variables](#environment-variables) below).
6. Click **Deploy Web Service**.

### Frontend Deployment: Vercel
1. Sign up on [Vercel](https://vercel.com/) and import your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. Vercel will automatically detect **Vite** as the framework preset.
4. Configure Build Settings:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Add the **Environment Variables**:
   * `VITE_API_BASE_URL`: Set this to your production backend Render URL (e.g. `https://nutrimind-backend.onrender.com`). Do *not* append `/api` to the end of the URL.
6. Click **Deploy**.

---

## 4. Environment Variables

### Backend Environment Variables (`backend/.env`)

Required variables for the API server:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | The port the backend listens on | `5000` |
| `MONGODB_URI` | Connection string for MongoDB Atlas or local | `mongodb://localhost:27017/nutrimind` |
| `NODE_ENV` | Environment stage name | `production` / `development` |
| `JWT_SECRET` | Secret key used for signing JWT access tokens | `your_super_secret_key_123` |
| `JWT_REFRESH_SECRET` | Secret key used for signing JWT refresh tokens | `your_super_secret_refresh_key` |
| `GEMINI_API_KEY` | Google Gemini API Key for recommendation engines | `AIzaSyD...` |
| `EMAIL_USER` | Support/OTP email address for SMTP mailing (Optional) | `support@nutrimind.ai` |
| `EMAIL_PASS` | Password/App password for email account (Optional) | `email_app_password` |
| `CLOUDINARY_URL` | Credentials for image file uploads (Optional) | `cloudinary://key:secret@cloud_name` |

### Frontend Environment Variables (`frontend/.env`)

Required variables for the web client:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend API (without trailing `/api`) | `https://nutrimind-backend.onrender.com` |
