# Project Structure

This document outlines the complete folder structure of the **NutriMind AI** repository.

## Repository Directory Tree

```text
nutrimind/
├── .github/                     # GitHub Configuration & Workflows
│   ├── ISSUE_TEMPLATE/          # Issue templates
│   │   ├── bug_report.md        # Bug report form template
│   │   ├── feature_request.md   # Feature suggestion template
│   │   └── question.md          # Question/Support template
│   └── PULL_REQUEST_TEMPLATE.md # PR description checklist template (uppercase)
├── assets/                      # Graphic and media branding assets
│   ├── banner.png               # Repository banner image
│   └── demo.mp4                 # Walkthrough demo video file
├── docs/                        # Deep-Dive Project Documentation
│   ├── screenshots/             # Screenshots directory (placeholder checklist)
│   │   └── README.md            # Guide to expected screenshots
│   ├── architecture.md          # Technical system diagrams & ER schemas (Relocated)
│   ├── architecture.png         # System Architecture Diagram (Generated)
│   ├── project_structure.md     # Project Folder Structure (This File)
│   ├── API.md                   # API Endpoints & Request/Response Contracts
│   ├── deployment.md            # Production & Local Deployment Instructions
│   ├── testing.md               # Quality Assurance & Manual Test Cases
│   └── highlights.md            # Key Project Highlights & Features
├── backend/                     # Node.js + Express + TypeScript Backend
│   ├── src/                     # Source Code
│   │   ├── config/              # Database Configurations
│   │   │   └── db.ts            # MongoDB connection logic
│   │   ├── controllers/         # Request handlers (logic layer)
│   │   │   ├── admin.controller.ts
│   │   │   ├── ai.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── dietitian.controller.ts
│   │   │   ├── food.controller.ts
│   │   │   └── progress.controller.ts
│   │   ├── middleware/          # Express route middlewares
│   │   │   └── auth.middleware.ts # JWT Auth and Role checks
│   │   ├── models/              # Mongoose data schemas (database layer)
│   │   │   ├── Appointment.ts
│   │   │   ├── Chat.ts
│   │   │   ├── Food.ts
│   │   │   ├── MealPlan.ts
│   │   │   ├── Progress.ts
│   │   │   ├── Recipe.ts
│   │   │   ├── Subscription.ts
│   │   │   └── User.ts
│   │   ├── routes/              # Express API route bindings
│   │   │   ├── admin.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── dietitian.routes.ts
│   │   │   ├── food.routes.ts
│   │   │   ├── index.ts         # Main router entry point
│   │   │   └── progress.routes.ts
│   │   ├── services/            # Third-party service integrations
│   │   │   └── ai.service.ts    # Gemini API interface
│   │   ├── utils/               # Common helper scripts
│   │   │   └── seeder.ts        # Database seeding script
│   │   └── server.ts            # Express server & Socket.io bootstrapper
│   ├── .env                     # Local Environment Variables (Git ignored)
│   ├── Dockerfile               # Backend Docker build instructions
│   ├── package.json             # NPM dependencies & running scripts
│   ├── tsconfig.json            # TypeScript compile options
│   └── dist/                    # Compiled JavaScript code (Git ignored)
├── frontend/                    # React 19 + TypeScript + Vite + Tailwind Frontend
│   ├── src/                     # Source Code
│   │   ├── components/          # Reusable UI widgets
│   │   │   └── layout/          # Page layouts and route guards
│   │   │       ├── DashboardLayout.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── pages/               # Top-level screen components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AiAssistant.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── ChatRooms.tsx
│   │   │   ├── DietitianDashboard.tsx
│   │   │   ├── FoodDatabase.tsx
│   │   │   ├── History.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Recipes.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── UserDashboard.tsx
│   │   │   └── VideoMeeting.tsx
│   │   ├── services/            # API call modules (Axios client setup)
│   │   │   └── api.ts
│   │   ├── store/               # Redux state management configuration
│   │   │   ├── authSlice.ts
│   │   │   └── index.ts
│   │   ├── index.css            # Tailwind directives and CSS variables
│   │   ├── main.tsx             # Application entry script
│   │   └── vite-env.d.ts        # Vite environment types
│   ├── .env                     # Local Frontend Environment Variables (Git ignored)
│   ├── Dockerfile               # Frontend Docker build instructions
│   ├── index.html               # Main SPA HTML structure
│   ├── package.json             # NPM dependencies & running scripts
│   ├── postcss.config.js        # PostCSS configuration for Tailwind
│   ├── tailwind.config.js       # Tailwind CSS theme configurations
│   ├── tsconfig.json            # TypeScript compile options
│   ├── vercel.json              # Vercel rewrites for client-side routing
│   └── vite.config.ts           # Vite Bundler settings
├── .gitignore                   # Files excluded from git tracking
├── LICENSE                      # MIT license declarations
├── CHANGELOG.md                 # Project version history log
├── CODE_OF_CONDUCT.md           # Community guidelines
├── CONTRIBUTING.md              # Open source contribution workflow guide
├── docker-compose.yml           # Multi-container orchestration instructions
├── README.md                    # Main Repository overview landing page
└── RELEASE_NOTES.md             # Detailed Release summaries
```

## Folder Structure Details

1. **Root Directory**: Contains workspace-level configurations (`docker-compose.yml`, `.gitignore`) and standard open-source documentation ([README.md](../README.md), [CONTRIBUTING.md](../CONTRIBUTING.md), [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md), [SECURITY.md](../SECURITY.md), [CHANGELOG.md](../CHANGELOG.md), [RELEASE_NOTES.md](../RELEASE_NOTES.md), [LICENSE](../LICENSE)).
2. **`assets/` Directory**: Contains project logo, banner graphics, and media assets.
3. **`docs/` Directory**: Central repository for detailed documentation, technical layout diagrams ([docs/architecture.md](architecture.md)), and user-facing checklists.
4. **`backend/` Directory**: Express server structured as an MVC-style API (Controllers, Models, Routes, Services). Using TypeScript for structural typing and compile-time type safety.
5. **`frontend/` Directory**: Modern React 19 Single Page Application bundled with Vite. Styled with Tailwind CSS and powered by Redux Toolkit for state management.
