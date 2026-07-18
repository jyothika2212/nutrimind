# Project Highlights

This document highlights the key features, architecture patterns, and technical innovations that make **NutriMind AI** a modern, robust, and scalable health platform.

---

## 1. AI-Driven Personalization Engine
NutriMind AI integrates state-of-the-art Generative AI to provide users with tailored wellness guidance:
* **Google Gemini Integration:** The platform connects with Gemini models to analyze user bio-data (weight, height, age, activity level, and fitness goals) and generate customized daily calorie and macronutrient (carbs/protein/fat) splits.
* **Unstructured Food Analysis:** Users can type plain text descriptions of what they ate (e.g. *"I had two scrambled eggs with a slice of whole wheat toast"*). The AI extracts food items, estimates portion sizes, and outputs precise nutrition calculations.
* **Dynamic Recipe Generator:** Generates custom recipes on the fly based on a list of ingredients currently available in the user's pantry, accommodating specific cuisine preference filters.

---

## 2. Secure Enterprise-Grade Authentication
Security is a core pillar of the platform design:
* **JWT Access & Refresh Token Rotation:** Implements stateless JSON Web Token authentication with safe access token expiry times, coupled with refresh token storage for secure, seamless session continuation.
* **Role-Based Access Control (RBAC):** Restricts API endpoints and client views dynamically according to granular roles: `Client`, `Dietitian`, `Nutritionist`, and `Admin`.
* **OTP Verification:** Incorporates email One-Time Passwords (OTP) printed to the backend console for account verification, ensuring user emails are validated before database access.

---

## 3. Immersive Dashboard & Glassmorphism UI
The user interface is designed to captivate users with high-fidelity aesthetics:
* **Modern CSS Styling:** Employs a dark-mode-first glassmorphism design language using translucent containers, blur backdrops, soft neon accents, and clean typography (Inter / Outfit).
* **Interactive Graphs (Recharts):** Renders progress logs (calories, sleep, water, and weight tracking) over time on interactive charts, offering micro-interactions, smooth hover animations, and dark-theme grids.
* **Framer Motion Animations:** Features entry animations, transition effects, and modal popups that make the user experience feel polished and responsive.

---

## 4. Real-time Communication Channels
Bridges the gap between clients and healthcare specialists:
* **Socket.IO Tunneling:** Establishes persistent WebSockets connections for real-time chat rooms between users and dietitian specialists.
* **Typing Indicators & Read Statuses:** Enhances chat interactivity with real-time indicator triggers ("User is typing...") and database-backed message status indicators.
* **Virtual Appointments with Video Links:** Users can request calendar slots with dietitians, which auto-generate custom Jitsi meeting links once approved by the specialist.

---

## 5. Ready-to-Run Docker Orchestration
Enables seamless developer onboarding and environment synchronization:
* **Multi-Container Architecture:** Packages frontend web client and backend API server in isolated Docker containers.
* **Docker Compose Configuration:** Connects services under a unified network interface, matching local ports for immediate deployment without setup scripts.
* **TypeScript Transpilation:** Dockerfiles handle multi-stage production builds, compiling source TypeScript files down to optimized Node.js bundles.
