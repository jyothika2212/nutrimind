# NutriMind AI - Nutrition & Wellness Platform

In today’s fast-paced world, maintaining a balanced diet can be challenging, and **NutriMind AI** is designed to simplify this journey by offering personalized nutritional guidance and support. Whether aiming to improve eating habits, manage a health condition, or achieve fitness goals, this app serves as a comprehensive tool for better health and wellness.

It leverages technology to provide features such as meal planning, dietary tracking, personalized recommendations, and access to educational resources. By incorporating extensive food databases, the app allows users to log meals, monitor calorie and nutrient intake, and gain insights into the nutritional value of various foods. It also offers recipe suggestions, grocery assistance, and interactive features for connecting with nutrition professionals.

Designed to empower individuals to make informed lifestyle choices, NutriMind AI is ideal for managing weight, enhancing athletic performance, accommodating dietary restrictions, or simply adopting healthier habits.

> [!IMPORTANT]
> **Disclaimer:** While NutriMind AI offers valuable support, it should complement—not replace—professional medical or dietary advice, and users are encouraged to consult qualified healthcare providers for personalized recommendations.

---

## 1. Project Folder Structure

* **`/backend`**: Node.js + Express + TypeScript API server using Mongoose ODM, JWT auth mechanisms, and Socket.io channels.
* **`/frontend`**: React 19 + TypeScript + Vite + Tailwind CSS dashboard with responsive glassmorphism themes and Recharts graphics.

---

## 2. Environment Variables Setup

### Backend Environment Configuration (`backend/.env`)

Create a `.env` file in the `/backend` folder with these variables:

```env
PORT=5000
retryWrites=true&w=majority&appName=Cluster0
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

---

## 3. Getting Started

### Local Setup Instructions

Ensure you have Node.js (v18+) and MongoDB installed locally or access to the Atlas Cloud cluster.

#### Step 1: Install & Run Backend Server

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Seed the database with initial users, foods database, and recipes:
   ```bash
   npm run seed
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

#### Step 2: Install & Run Frontend Client

1. Open another terminal session and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the client dev server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*

---

## 4. Run via Docker Compose

To start the entire environment (Frontend, Backend, Redis) in unified containers:

1. Run:
   ```bash
   docker-compose up --build
   ```
2. Once complete, navigate to:
   * Frontend App: `http://localhost:3000`
   * Backend REST API: `http://localhost:5000`

---

## 5. Seed Test Profiles

Use these credentials to test the platform dashboards after running `npm run seed`:

* **Admin Portal**:
  * Email: `admin@nutrimind.ai`
  * Password: `nutri123`
* **Dietitian Specialist Workspace**:
  * Email: `sarah@nutrimind.ai`
  * Password: `nutri123`
* **Regular Client User**:
  * Email: `manoj@example.com`
  * Password: `nutri123`

---

## 6. Production Deployment Setup

This section details how to deploy the platform's frontend on Vercel and the backend on Render.

### Backend Deployment (Render)

Deploy the `/backend` folder as a **Web Service** on [Render](https://render.com/).

1. **Connect Repository**: Connect your GitHub repository to Render.
2. **Configure Root Directory**: Set `backend` as the Root Directory.
3. **Build & Start Settings**:
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build` (This runs TypeScript compilation `tsc`)
   * **Start Command**: `npm run start` (Runs `node dist/server.js`)
4. **Environment Variables**: Add the following in **Environment**:
   * `NODE_ENV`: `production`
   * `PORT`: `5000` (Render will automatically override this if needed)
   * `MONGODB_URI`: *Your Production MongoDB Atlas connection URI string*
   * `JWT_SECRET`: *A secure random string for signing JWT tokens*
   * `JWT_REFRESH_SECRET`: *A secure random string for signing JWT refresh tokens*
   * `GEMINI_API_KEY`: *Your Google Gemini API Key*
   * `EMAIL_USER`: *Your SMTP support email address (Optional)*
   * `EMAIL_PASS`: *Your SMTP support email password (Optional)*
   * `CLOUDINARY_URL`: *Cloudinary credentials (Optional)*

### Frontend Deployment (Vercel)

Deploy the `/frontend` folder on [Vercel](https://vercel.com/).

1. **Connect Repository**: Import your GitHub repository.
2. **Configure Root Directory**: Set `frontend` as the Root Directory.
3. **Build & Development Settings**:
   * **Framework Preset**: `Vite` (automatically detected)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. **Environment Variables**:
   * Add `VITE_API_BASE_URL` and set its value to your Render Web Service URL (e.g. `https://nutrimind-backend.onrender.com`). Do *not* add `/api` at the end of the URL (it is dynamically appended).
5. **Client-side Routing**:
   * The repository contains a pre-configured [vercel.json](file:///c:/Users/manig/Downloads/nutrimind/frontend/vercel.json) rewrite rule inside the `frontend` folder to handle React routing automatically.

