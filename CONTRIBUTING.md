# Contributing to NutriMind AI

First off, thank you for considering contributing to **NutriMind AI**! It is people like you who make open-source software a wonderful place to build.

To maintain repository quality and code stability, please review these contributing guidelines before making changes.

---

## 1. Local Development Setup

To get the codebase running locally on your machine, follow the instructions in the [Deployment Guide](docs/deployment.md). 

Briefly:
1. Fork the repository and clone it locally.
2. Initialize and configure the `.env` configuration files inside `/backend` and `/frontend`.
3. Run `npm install` inside both directories.
4. Run the seed script in `/backend` using `npm run seed`.
5. Run the dev servers using `npm run dev` in separate terminals.

---

## 2. Branch Naming Conventions

When creating branches, use descriptive prefixes followed by a short summary of the task:

* **`feature/<short-description>`**: For adding new features (e.g. `feature/water-intake-reminders`).
* **`bugfix/<short-description>`**: For fixing bugs (e.g. `bugfix/jwt-expiry-redirect`).
* **`docs/<short-description>`**: For documentation modifications (e.g. `docs/api-corrections`).
* **`refactor/<short-description>`**: For code changes that neither fix a bug nor add a feature.
* **`test/<short-description>`**: For adding or updating test cases.

Example branch: `feature/meal-planner-export`

---

## 3. Commit Message Standards

We follow the **Conventional Commits** specification for commit logs:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types:
* **`feat`**: A new feature.
* **`fix`**: A bug fix.
* **`docs`**: Documentation only changes.
* **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).
* **`refactor`**: A code change that neither fixes a bug nor adds a feature.
* **`perf`**: A code change that improves performance.
* **`test`**: Adding missing tests or correcting existing tests.
* **`chore`**: Changes to the build process or auxiliary tools and libraries.

### Examples:
* `feat(auth): add google sign-in login handler`
* `fix(charts): correct date alignment on dashboard progress graph`
* `docs(readme): add docker run instructions`

---

## 4. Pull Request Checklist

Before submitting a Pull Request, verify that your changes meet the following criteria:

- [ ] **Tests Pass**: Run any automated tests to ensure no regressions are introduced.
- [ ] **Compile Success**: Ensure both frontend and backend build without errors (`npm run build`).
- [ ] **Documentation**: Update the `README.md` or files in `docs/` if you added/changed endpoints or features.
- [ ] **No Secrets Exposed**: Double-check that no private API keys or databases URLs are included in files or commits.
- [ ] **Branch Merged**: Ensure your branch is updated with the latest `main` branch before opening the PR.
- [ ] **Clean Code**: Remove debug logs, `console.log()` statements, or temporary scratch files before pushing.
