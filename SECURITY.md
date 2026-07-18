# Security Policy

This document outlines the security procedures, reporting guidelines, and secrets policy for the **NutriMind AI** project.

---

## 1. Vulnerability Disclosure Policy

We take security vulnerabilities seriously and appreciate responsible disclosure from researchers and the open-source community.

If you believe you have found a security vulnerability in this project (e.g. SQL/NoSQL injection, authentication bypass, data leak, cross-site scripting), please report it to us immediately via the channel described below.

### Do Not File Public Issues
> [!WARNING]
> Please do NOT file a public GitHub issue for security-related bugs. Disclosing vulnerabilities publicly makes them accessible to malicious actors before a patch can be developed.

---

## 2. Reporting a Vulnerability

To report a vulnerability, please email us at `security@nutrimind.ai` with the following details:
1. **Description of the vulnerability:** Explain the nature of the issue and what assets/routes are affected.
2. **Steps to Reproduce:** Provide detailed steps, code snippets, curl commands, or screenshots demonstrating how to trigger the vulnerability.
3. **Potential Impact:** Describe what an attacker could achieve (e.g. privilege escalation, unauthorized database reads).
4. **Proposed Fix (Optional):** If you have identified a potential fix, feel free to suggest it.

We aim to acknowledge receipt of your report within 48 hours and provide a timeline for resolution within 7 business days.

---

## 3. Environment Variables & Secrets Policy

Maintaining the security of deployment secrets is paramount.

### Hardcoded Credentials
* **Never hardcode secrets:** All secret keys, API credentials, connection string passwords, or JWT secrets must remain outside the version control system.
* **Always use Environment Variables:** Utilize `.env` files locally and the environment configuration settings of your hosting providers (e.g., Render, Vercel) for storing production values.

### Tracked `.env` Prevention
* The project includes a pre-configured `.gitignore` file that excludes all `.env` files from being tracked by Git.
* If you accidentally commit a secret to version control:
  1. Revoke the secret/key immediately at the source provider (e.g., reset your MongoDB credentials or Google Gemini API key).
  2. Use tools like `git-filter-repo` or `BFG Repo-Cleaner` to purge the secret from the repository commit history.
