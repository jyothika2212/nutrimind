# Quality Assurance & Testing Guide

This document maps out testing strategies, manual procedures, and key test suites for verifying **NutriMind AI**.

---

## 1. Testing Frameworks

### Backend Testing
* **Automated Tests:** Not currently implemented.
  * *Note: The backend package script `"test"` contains a placeholder outputting `"Error: no test specified"`. No automated unit or integration tests are currently configured.*

### Frontend Testing
* **Automated Tests:** Not currently implemented.
  * *Note: The frontend does not contain any test runners, scripts, or spec files.*

---

## 2. Manual Testing Checklist

Follow these steps to manually verify the platform dashboard features in your local environment.

### Phase 1: Authentication & Authorization Flow
1. **Account Registration:**
   * Go to `http://localhost:3000/register`.
   * Input name, email, password, and select role `Client`. Click Register.
   * Verify redirect to dashboard and check that local storage contains a JWT.
2. **Account Login:**
   * Go to `http://localhost:3000/login`.
   * Log in using your registered credentials.
   * Verify redirection and user context values in Redux storage.
3. **Role Restriction:**
   * Try to access `http://localhost:3000/admin` using a standard Client account.
   * Verify that the client is redirected or receives an Access Denied message.

### Phase 2: Progress Logging Flow
1. **Water Logging:**
   * On the User Dashboard, click the add water button.
   * Add 500ml of water and check that the progress circle increments correctly.
2. **Meal Logging:**
   * Go to the meal logger pane. Click **Log Meal** for Breakfast.
   * Search for "Oatmeal" in the food catalog, select it, input servings, and click save.
   * Verify that the calorie counter dashboard updates with the food's nutrition values.
3. **Vitals & Workout Logging:**
   * Log weight (e.g. 75 kg) and sleep duration (8 hours).
   * Verify they display correctly on the user progress charts.

### Phase 3: AI recommendations
1. **AI Chatbot Consultant:**
   * Go to `http://localhost:3000/ai-assistant` (or select AI Chat).
   * Submit a query: *"Suggest a dinner recipe high in protein."*
   * Verify that the AI generates a coherent response and saves the chat history.
2. **Recipe Generator:**
   * Go to the Recipes page, check off ingredients (e.g. Tomato, Spinach, Eggs), and select cuisine style.
   * Click **Generate**. Verify that the AI constructs a custom cooking instruction list.

### Phase 4: Specialist / Dietitian Workspace
1. **Assigning a Dietitian:**
   * Log in as a Client and navigate to the Specialists page.
   * Select a dietitian (e.g. Sarah Specialist) and click **Assign**.
2. **Scheduling an Appointment:**
   * Click **Book Appointment**, choose a future date, and submit.
   * Verify that the status of the appointment is displayed as **Pending**.
3. **Dietitian Status Approval:**
   * Log out and log in as the Dietitian (`sarah@nutrimind.ai` / password: `nutri123`).
   * Navigate to the appointments calendar, find the pending appointment, and click **Approve**.
   * Verify that the status changes to **Approved** and the video link is generated.

### Phase 5: Admin Panel
1. **Platform Statistics:**
   * Log in as the administrator (`admin@nutrimind.ai` / password: `nutri123`).
   * Navigate to the Admin Dashboard.
   * Verify that cards display totals for active users, logged records, and system stats.
2. **User Control Management:**
   * Find a user in the user tables, change their role from `Client` to `Nutritionist`, and click save.
   * Log in with that user's credentials to verify they now have access to specialist routes.

---

## 3. Test Cases Spreadsheet Matrix

Below is a matrix of test cases for verification before deploying updates:

| Test Case ID | Feature Area | Description | Expected Results | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-001** | Auth | Register with existing email address | Show registration error: "A user with this email address already exists" | Pass |
| **TC-002** | Auth | Login with incorrect password | Show validation error: "Invalid email or password credentials" | Pass |
| **TC-003** | Auth | Access protected route `/today` without token | Reject request with `401 Unauthorized` | Pass |
| **TC-004** | Progress | Log 250ml water intake | Progress log increments by 250ml; response returns `200 OK` | Pass |
| **TC-005** | Progress | Log workout: Run, 30m, 300 kcal | Workout added to database; progress list updates calories burned | Pass |
| **TC-006** | Food | Search food database for query "rice" | Returns list of foods containing "rice" in name | Pass |
| **TC-007** | Food | Non-admin user tries to create food item | Reject request with `403 Forbidden` | Pass |
| **TC-008** | Dietitian | Create meal plan with invalid date ranges | Reject request with `400 Bad Request` | Pass |
| **TC-009** | AI | Prompt AI Chat with blank input string | Show input validation error; do not call Google Gemini API | Pass |
| **TC-010** | Admin | Admin updates client account to role 'Admin' | User role changes to 'Admin' in DB; response returns updated user | Pass |
