# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-18

### Added
- Created complete developer guide and structured repository documentation.
- Generated a professional software architecture diagram inside `docs/architecture.png`.
- Added annotated folder mapping in `docs/project_structure.md`.
- Documented all backend REST API routes and socket events in `docs/API.md` (verified directly against Express controllers).
- Wrote deployment runbooks for Vercel, Render, and Docker containerization in `docs/deployment.md`.
- Created manual testing checklist sheets and test cases in `docs/testing.md`.
- Added feature highlights and project innovations overview in `docs/highlights.md`.
- Formulated responsible disclosure guidelines and secrets safety in `SECURITY.md`.
- Standardized open-source contributor instructions in `CONTRIBUTING.md`.
- Adopted the Contributor Covenant Code of Conduct in `CODE_OF_CONDUCT.md`.
- Documented compilation instructions and release logs in `RELEASE_NOTES.md`.
- Added standard status badges to the project `README.md`.
- Set up an automated CI check workflow in `.github/workflows/build.yml` to compile TypeScript.

---

## [0.9.0] - 2026-07-10

### Added
- Initial implementation of the NutriMind AI web client and API server.
- Integrated Google Gemini AI API services for custom diet analysis and recipes generation.
- Established Mongoose schema models (`User`, `Food`, `Recipe`, `Progress`, `Appointment`, `Chat`).
- Developed React 19 UI with Tailwind CSS glassmorphic cards and Recharts analytics.
- Added Socket.IO room messaging tunnels for real-time dietitian chat communications.
- Configured multi-container builds using Docker and Docker Compose.
- Seeded default mock profiles for user dashboards testing.

[1.0.0]: https://github.com/jyothika2212/nutrimind/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/jyothika2212/nutrimind/releases/tag/v0.9.0
