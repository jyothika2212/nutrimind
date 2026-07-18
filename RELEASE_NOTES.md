# Release Notes - NutriMind AI

## Version 1.0.0 (Initial Open Source Release)
**Date:** July 18, 2026

We are excited to announce the initial release of **NutriMind AI** (`v1.0.0`). This version establishes a fully functional, high-fidelity platform for tracking personal wellness, logging meals, consulting generative AI tools, scheduling specialist appointments, and reviewing health records.

---

## 1. Key Features Included

### Client Portal
* **Daily Progress Dashboard:** Visual summaries of water logging, calorie intake vs limits, weight vitals, sleep intervals, and custom health inputs.
* **Smart Food Catalog:** Direct keyword search engine spanning standard food lists, complete with nutrient metrics (protein, fat, carbs, calories).
* **AI Recipe Builder:** Generates step-by-step custom recipes on demand from ingredients listed in the user's pantry.
* **AI Nutritionist Agent:** Natural language chat companion that answers wellness questions, assesses meal logs, and provides general suggestions.
* **Specialist Consultation Scheduler:** Search listed dietitians, assign a specialist to your profile, request appointment times, and join virtual video calls.

### Dietitian Portal
* **Client Monitoring Panel:** Access bio-profiles and logs (meals, workouts, calories) of assigned client accounts.
* **Dynamic Meal Planner:** Create and assign personalized breakfast/lunch/dinner/snack schedules to specific clients.
* **Consulting Manager:** Manage appointment requests, update status (Approve/Reject), and auto-attach meeting links.

### Admin Portal
* **System Statistics Insights:** Renders dashboard tracking accounts metrics, total activity, and records growth metrics.
* **Role Management Controls:** Search, promote, demote, or delete registered accounts to enforce system permissions.

---

## 2. Documentation Updates (Repository Overhaul)
As part of our commitment to high-quality repository standards, we have implemented the following open-source documentation guides:
* **System Architecture Diagram ([docs/architecture.png](docs/architecture.png)):** Professional flow mapping.
* **Annotated Folder Tree ([docs/project_structure.md](docs/project_structure.md)):** Deep dive folder structure.
* **REST API & WebSockets Contract ([docs/API.md](docs/API.md)):** Complete route payload details.
* **Local & Production Runbook ([docs/deployment.md](docs/deployment.md)):** Render, Vercel, and Docker setup.
* **QA & Testing Standards ([docs/testing.md](docs/testing.md)):** Manual QA runbooks and testing details.
* **Core Project Highlights ([docs/highlights.md](docs/highlights.md)):** Structural, security, and UI details.
* **Standard Open Source Protocols:** Standardized [SECURITY.md](SECURITY.md), [CHANGELOG.md](CHANGELOG.md), [CONTRIBUTING.md](CONTRIBUTING.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) protocols in the repository root.

---

## 3. Bug Fixes & Code Refactoring
* Consolidated Mongoose database connections inside the backend bootstrap process.
* Patched route permissions to ensure dietitian workspaces cannot be loaded by unauthorized client sessions.
* Fixed Vite configuration rewrites inside `vercel.json` to handle client-side React routes refresh errors.
* Re-designed responsive layout grids using CSS custom properties to avoid grid overflow on narrow viewports.
