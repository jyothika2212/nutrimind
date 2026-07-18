# NutriMind AI API Documentation

This document describes all API endpoints available on the **NutriMind AI** backend server.

The default server base URL is:
* Local: `http://localhost:5000/api`
* Production: `https://<your-backend-domain>/api`

---

## Global Standards

### Authentication
Most endpoints require a JSON Web Token (JWT) passed in the HTTP Authorization header:
```http
Authorization: Bearer <your_jwt_access_token>
```

### Common Error Responses
If a request fails, the server responds with a standard error body and an appropriate HTTP status code:

* **`400 Bad Request`**: Missing required parameters or validation error.
* **`401 Unauthorized`**: Missing or invalid authentication token.
* **`403 Forbidden`**: Insufficient permissions/roles.
* **`404 Not Found`**: Resource does not exist.
* **`500 Internal Server Error`**: Unexpected database or server exception.

Example error body:
```json
{
  "error": "Access denied. Token is missing or invalid."
}
```

---

## 1. Authentication Endpoints (`/auth`)

### Register User
Create a new account on the platform.
* **Method:** `POST`
* **URL:** `/auth/register`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "role": "Client"
  }
  ```
  *(Note: `role` must be either `Client`, `Dietitian`, `Nutritionist`, or `Admin`)*
* **Success Response (`201 Created`):**
  ```json
  {
    "message": "User registered successfully",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "65e23a41e9b21f3a9856df12",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Client",
      "isVerified": true
    }
  }
  ```

### Login
Authenticate an existing user.
* **Method:** `POST`
* **URL:** `/auth/login`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "65e23a41e9b21f3a9856df12",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Client",
      "profilePicture": "http://example.com/avatar.jpg",
      "isVerified": true,
      "userDetails": {}
    }
  }
  ```

### Refresh Token
Obtain a new access token using a refresh token.
* **Method:** `POST`
* **URL:** `/auth/refresh-token`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### Request OTP
Send a verification OTP to the user's email.
* **Method:** `POST`
* **URL:** `/auth/otp-request`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "OTP code sent successfully to email (check console logs)"
  }
  ```

### Verify OTP
Verify email using the sent OTP code.
* **Method:** `POST`
* **URL:** `/auth/otp-verify`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "otp": "123456"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "OTP verification successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "65e23a41e9b21f3a9856df12",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Client",
      "profilePicture": "http://example.com/avatar.jpg"
    }
  }
  ```

### Save Profile Details
Save user profile characteristics for recommendation logic.
* **Method:** `POST`
* **URL:** `/auth/profile-details`
* **Authentication:** Required (Bearer Token)
* **Request Body:**
  ```json
  {
    "userDetails": {
      "weight": 75,
      "height": 180,
      "age": 30,
      "gender": "male",
      "activityLevel": "moderately_active",
      "goal": "lose_weight",
      "dietaryPreferences": ["vegetarian"]
    }
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "_id": "65e23a41e9b21f3a9856df12",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Client",
      "userDetails": {
        "weight": 75,
        "height": 180,
        "age": 30,
        "gender": "male",
        "activityLevel": "moderately_active",
        "goal": "lose_weight",
        "dietaryPreferences": ["vegetarian"],
        "bmi": 23.15
      }
    }
  }
  ```

### Google Mock Authentication
Sign in using mock Google parameters for testing.
* **Method:** `POST`
* **URL:** `/auth/google-mock`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "name": "Google User",
    "email": "google.user@example.com",
    "googleId": "1029384756",
    "profilePicture": "http://example.com/picture.jpg"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Google login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "65e23a41e9b21f3a9856df12",
      "name": "Google User",
      "email": "google.user@example.com",
      "role": "User",
      "profilePicture": "http://example.com/picture.jpg"
    }
  }
  ```

### Google Login
Sign in using an actual Google ID Token.
* **Method:** `POST`
* **URL:** `/auth/google`
* **Authentication:** None
* **Request Body:**
  ```json
  {
    "idToken": "google_id_token_jwt"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Google login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "65e23a41e9b21f3a9856df12",
      "name": "Google User",
      "email": "google.user@example.com",
      "role": "User",
      "profilePicture": "http://example.com/picture.jpg",
      "isVerified": true,
      "userDetails": {}
    }
  }
  ```

---

## 2. Progress Endpoints (`/progress`)

### Get Today's Progress
Fetch the progress tracking metrics log for a specific date (defaults to today's date if omitted).
* **Method:** `GET`
* **URL:** `/progress/today`
* **Query Parameters:**
  * `date` (optional, format `YYYY-MM-DD`, e.g., `/progress/today?date=2026-07-18`)
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  {
    "_id": "65e23b55e9b21f3a9856df55",
    "userId": "65e23a41e9b21f3a9856df12",
    "date": "2026-07-18",
    "waterIntake": 1200,
    "weight": 75,
    "sleepDuration": 7.5,
    "meals": {
      "breakfast": [],
      "lunch": [],
      "dinner": [],
      "snacks": []
    },
    "workouts": []
  }
  ```

### Log a Meal
Add a food item consumed to a specific meal slot.
* **Method:** `POST`
* **URL:** `/progress/meal`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "date": "2026-07-18",
    "mealType": "breakfast",
    "foodItem": {
      "foodName": "Oatmeal",
      "serving": "1 bowl",
      "calories": 150,
      "protein": 5,
      "carbs": 27,
      "fat": 3
    }
  }
  ```
  *(Note: `mealType` must be either `breakfast`, `lunch`, `dinner`, or `snacks`)*
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Meal logged successfully",
    "progress": { ...updated progress log object... }
  }
  ```

### Log Water Intake
Add water amount in milliliters.
* **Method:** `POST`
* **URL:** `/progress/water`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "date": "2026-07-18",
    "amount": 250
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Water intake logged",
    "progress": { ...updated progress log object... }
  }
  ```

### Log a Workout
Record physical exercise workouts.
* **Method:** `POST`
* **URL:** `/progress/workout`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "date": "2026-07-18",
    "name": "Running",
    "duration": 30,
    "caloriesBurned": 300,
    "intensity": "High"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Workout logged successfully",
    "progress": { ...updated progress log object... }
  }
  ```

### Log Vitals
Log health indicators (weight, sleep duration, heart rate, blood sugar, blood pressure).
* **Method:** `POST`
* **URL:** `/progress/vitals`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "date": "2026-07-18",
    "weight": 74.8,
    "sleepDuration": 8,
    "heartRate": 72,
    "bloodSugar": 95,
    "systolic": 120,
    "diastolic": 80
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Health indicators logged successfully",
    "progress": { ...updated progress log object... }
  }
  ```

### Get History
Retrieve history logs in chronological order.
* **Method:** `GET`
* **URL:** `/progress/history`
* **Query Parameters:**
  * `limit` (optional, default is `7`, e.g., `/progress/history?limit=7`)
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "date": "2026-07-18",
      "waterIntake": 1450,
      "weight": 74.8,
      "sleepDuration": 8,
      "meals": { ... },
      "workouts": [ ... ]
    }
  ]
  ```

---

## 3. Food Endpoints (`/food`)

### Search Foods
Search the food catalog with optional pagination.
* **Method:** `GET`
* **URL:** `/food/search`
* **Query Parameters:**
  * `q` (optional, query text matching name or category)
  * `category` (optional, category filter)
  * `page` (optional, default is `1`)
  * `limit` (optional, default is `10`)
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  {
    "foods": [
      {
        "_id": "65e24c90e9b21f3a9856e100",
        "name": "Apple",
        "calories": 52,
        "protein": 0.3,
        "carbs": 14,
        "fat": 0.2,
        "servingSize": "100g",
        "category": "Fruits"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
  ```

### Get Categories
List all distinct food categories in the database.
* **Method:** `GET`
* **URL:** `/food/categories`
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  ["Fruits", "Vegetables", "Grains", "Protein", "Dairy", "Snacks"]
  ```

### Get Recipes
List all stored recipes.
* **Method:** `GET`
* **URL:** `/food/recipes`
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "65e24cde9b21f3a9856e110",
      "name": "Quinoa Salad",
      "ingredients": ["Quinoa", "Cucumber", "Tomato", "Olive Oil"],
      "cookingSteps": ["Boil quinoa.", "Chop vegetables.", "Mix together and drizzle olive oil."],
      "calories": 220,
      "cuisine": "Healthy"
    }
  ]
  ```

### Create Food Item
Add a food item manually to the food catalog.
* **Method:** `POST`
* **URL:** `/food/create`
* **Authentication:** Required (Admin only)
* **Request Body:**
  ```json
  {
    "name": "Greek Yogurt",
    "calories": 59,
    "protein": 10,
    "carbs": 3.6,
    "fat": 0.4,
    "servingSize": "100g",
    "category": "Dairy"
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "message": "Food item created successfully",
    "food": {
      "_id": "65e24cbfe9b21f3a9856e108",
      "name": "Greek Yogurt",
      "calories": 59,
      "protein": 10,
      "carbs": 3.6,
      "fat": 0.4,
      "servingSize": "100g",
      "category": "Dairy"
    }
  }
  ```

---

## 4. Dietitian & Appointment Endpoints (`/dietitian`)

### Get Dietitians List
List dietitians/nutritionists registered in the system.
* **Method:** `GET`
* **URL:** `/dietitian/list`
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "65e23d01e9b21f3a9856dfd0",
      "name": "Sarah Specialist",
      "email": "sarah@nutrimind.ai",
      "role": "Dietitian",
      "dietitianDetails": {
        "specialization": "Clinical Nutrition",
        "experience": 5
      }
    }
  ]
  ```

### Assign Dietitian
Associate a dietitian to the client's profile.
* **Method:** `POST`
* **URL:** `/dietitian/assign`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "dietitianId": "65e23d01e9b21f3a9856dfd0"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Dietitian assigned successfully",
    "user": { ...updated user object... }
  }
  ```

### Create Appointment
Book a consulting appointment slot. Creates a Jitsi Meet URL for the call.
* **Method:** `POST`
* **URL:** `/dietitian/appointment`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "dietitianId": "65e23d01e9b21f3a9856dfd0",
    "date": "2026-07-20T10:00:00.000Z",
    "duration": 30,
    "notes": "Discussing my weekly diet recommendation plan details."
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "message": "Appointment requested successfully",
    "appointment": {
      "_id": "65e23d88e9b21f3a9856dfe0",
      "userId": "65e23a41e9b21f3a9856df12",
      "dietitianId": "65e23d01e9b21f3a9856dfd0",
      "date": "2026-07-20T10:00:00.000Z",
      "duration": 30,
      "notes": "Discussing my weekly diet recommendation plan details.",
      "videoLink": "https://meet.jit.si/NutriMind-abc123de",
      "status": "Pending"
    }
  }
  ```

### Get Appointments
Retrieve scheduled or historical appointments (filtered based on the role of the caller).
* **Method:** `GET`
* **URL:** `/dietitian/appointments`
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "65e23d88e9b21f3a9856dfe0",
      "date": "2026-07-20T10:00:00.000Z",
      "status": "Pending",
      "userId": {
        "_id": "65e23a41e9b21f3a9856df12",
        "name": "Manoj Client",
        "email": "manoj@example.com"
      },
      "dietitianId": {
        "_id": "65e23d01e9b21f3a9856dfd0",
        "name": "Sarah Specialist",
        "email": "sarah@nutrimind.ai"
      },
      "videoLink": "https://meet.jit.si/NutriMind-abc123de"
    }
  ]
  ```

### Get Meal Plans
Fetch meal plans assigned to the client (or created by the dietitian).
* **Method:** `GET`
* **URL:** `/dietitian/mealplans`
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "65e23df0e9b21f3a9856dfa1",
      "title": "Weight Loss Program",
      "userId": {
        "_id": "65e23a41e9b21f3a9856df12",
        "name": "Manoj Client",
        "email": "manoj@example.com"
      },
      "creatorId": {
        "_id": "65e23d01e9b21f3a9856dfd0",
        "name": "Sarah Specialist",
        "email": "sarah@nutrimind.ai"
      },
      "totalCaloriesLimit": 1800,
      "startDate": "2026-07-18T00:00:00.000Z",
      "endDate": "2026-07-25T00:00:00.000Z",
      "days": [...]
    }
  ]
  ```

### Get Assigned Clients
Get clients assigned to a dietitian.
* **Method:** `GET`
* **URL:** `/dietitian/clients`
* **Authentication:** Required (Dietitian/Nutritionist only)
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "65e23a41e9b21f3a9856df12",
      "name": "Manoj Client",
      "email": "manoj@example.com",
      "userDetails": {
        "weight": 70,
        "height": 175,
        "age": 28,
        "goal": "maintain_weight",
        "assignedDietitian": "65e23d01e9b21f3a9856dfd0"
      }
    }
  ]
  ```

### Update Appointment Status
Approve, cancel, or complete an appointment request.
* **Method:** `POST`
* **URL:** `/dietitian/appointment/:id/status`
* **Authentication:** Required (Dietitian, Nutritionist, or Admin)
* **Request Body:**
  ```json
  {
    "status": "Approved"
  }
  ```
  *(Note: `status` can be `Approved`, `Cancelled`, or `Completed`)*
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "Appointment status set to Approved",
    "appointment": { ...updated appointment object... }
  }
  ```

### Create Meal Plan
Assign a custom meal plan sheet to a client.
* **Method:** `POST`
* **URL:** `/dietitian/mealplan`
* **Authentication:** Required (Dietitian or Nutritionist only)
* **Request Body:**
  ```json
  {
    "userId": "65e23a41e9b21f3a9856df12",
    "title": "Low Carb Program",
    "startDate": "2026-07-18",
    "endDate": "2026-07-25",
    "totalCaloriesLimit": 1600,
    "days": [
      {
        "dayOfWeek": "Monday",
        "breakfast": [
          { "foodName": "Eggs", "serving": "2 large boiled", "calories": 140, "protein": 12, "carbs": 1, "fat": 10 }
        ],
        "lunch": [],
        "dinner": [],
        "snacks": [],
        "notes": "Drink warm lemon water in the morning."
      }
    ]
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "message": "Meal Plan assigned to client successfully",
    "plan": { ...created meal plan object... }
  }
  ```

---

## 5. AI Recommendations Endpoints (`/ai`)

### Get Diet Recommendation
Generate recommended daily calorie target and macronutrient guidelines based on the user's database profile (weight, age, goal, medical conditions) using Google Gemini. Updates the `calorieGoal` property on the user profile.
* **Method:** `POST`
* **URL:** `/ai/diet-recommendation`
* **Authentication:** Required
* **Request Body:** None (reads from database user profile details)
* **Success Response (`200 OK`):**
  ```json
  {
    "calories": 1800,
    "macros": { "protein": 30, "carbs": 40, "fat": 30 },
    "guidelines": ["Avoid high sugar intake", "Incorporate leafy greens"],
    "avoid": ["Refined sugar", "Processed meats"],
    "sampleMenu": {
      "breakfast": "Egg white omelet with spinach",
      "lunch": "Grilled chicken breast with quinoa",
      "dinner": "Baked salmon with asparagus",
      "snacks": "Mixed almonds and walnuts"
    }
  }
  ```

### Get Weekly Diet Plan
Generate a full 7-day meal plan based on user's database goal, preference, and calorie target.
* **Method:** `POST`
* **URL:** `/ai/weekly-diet`
* **Authentication:** Required
* **Request Body:** None (reads from database user profile details)
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "day": "Monday",
      "breakfast": "Greek yogurt with honey (250 kcal)",
      "lunch": "Turkey wraps with salad (450 kcal)",
      "dinner": "Tofu with brown rice (500 kcal)",
      "snacks": "Fresh apple (80 kcal)"
    }
  ]
  ```

### Generate Recipe
Generate a custom recipe based on ingredients provided.
* **Method:** `POST`
* **URL:** `/ai/recipe-generator`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "ingredients": ["Tomato", "Spinach", "Tofu"],
    "dietType": "Vegetarian"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "name": "Stir-fried Tofu with Tomato and Spinach",
    "prepTime": 15,
    "steps": [
      "Press and cube the tofu.",
      "Sauté tomatoes until soft, then stir in spinach.",
      "Add cubed tofu and stir gently. Season with soy sauce."
    ],
    "nutrition": {
      "calories": 280,
      "protein": 14,
      "carbs": 8,
      "fat": 16
    }
  }
  ```

### Analyze Food Description
Parse unstructured text description to estimate macro profiles.
* **Method:** `POST`
* **URL:** `/ai/analyze-food`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "description": "I had a plate of brown rice, a grilled chicken breast and a cup of steamed broccoli"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "foodName": "Brown Rice, Grilled Chicken Breast, Steamed Broccoli",
    "calories": 480,
    "protein": 42,
    "carbs": 50,
    "fat": 8,
    "fiber": 4,
    "sugar": 2,
    "servingSize": "1 plate"
  }
  ```

### Chat with AI Nutritionist
Converse with the virtual AI consultant.
* **Method:** `POST`
* **URL:** `/ai/chat`
* **Authentication:** Required
* **Request Body:**
  ```json
  {
    "message": "Is peanut butter good for building muscle?",
    "history": []
  }
  ```
  *(Note: `history` format is `[ { "role": "user" | "model", "parts": "string message text" } ]`)*
* **Success Response (`200 OK`):**
  ```json
  {
    "reply": "Yes! Peanut butter is highly beneficial for muscle building. It is calorie-dense and provides quality plant protein..."
  }
  ```

---

## 6. Admin Endpoints (`/admin`)

### Get Platform Stats
Fetch counts of registered entities and performance aggregates.
* **Method:** `GET`
* **URL:** `/admin/stats`
* **Authentication:** Required (Admin only)
* **Success Response (`200 OK`):**
  ```json
  {
    "totalUsers": 12,
    "totalDietitians": 2,
    "totalFoods": 48,
    "totalRecipes": 15,
    "totalAppointments": 8,
    "totalLogs": 32,
    "totalCaloriesTracked": 42890
  }
  ```

### Get All Users
List all registered users without password fields.
* **Method:** `GET`
* **URL:** `/admin/users`
* **Authentication:** Required (Admin only)
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "65e23a41e9b21f3a9856df12",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Client",
      "isVerified": true,
      "createdAt": "2026-07-18T10:00:00.000Z"
    }
  ]
  ```

### Update User Role
Modify account privileges (e.g. promoting client to specialist).
* **Method:** `POST`
* **URL:** `/admin/user/role`
* **Authentication:** Required (Admin only)
* **Request Body:**
  ```json
  {
    "userId": "65e23a41e9b21f3a9856df12",
    "role": "Dietitian"
  }
  ```
  *(Note: `role` must be either `User`, `Dietitian`, `Nutritionist`, or `Admin`)*
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "User role updated successfully",
    "user": {
      "_id": "65e23a41e9b21f3a9856df12",
      "role": "Dietitian"
    }
  }
  ```

### Delete User
Permanently remove an account.
* **Method:** `DELETE`
* **URL:** `/admin/user/:id`
* **Authentication:** Required (Admin only)
* **Success Response (`200 OK`):**
  ```json
  {
    "message": "User deleted from platform"
  }
  ```

---

## 7. Chat Endpoints (`/chat`)

### Get Chat History
Fetch logs of messaging chat rooms.
* **Method:** `GET`
* **URL:** `/chat/history/:chatId`
* **Authentication:** Required
* **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "65e23f00e9b21f3a9856e0a5",
      "chatId": "65e23a41e9b21f3a9856df12-65e23d01e9b21f3a9856dfd0",
      "senderId": "65e23a41e9b21f3a9856df12",
      "recipientId": "65e23d01e9b21f3a9856dfd0",
      "messageText": "Hello, is this meal plan suitable for my training program?",
      "isRead": true,
      "createdAt": "2026-07-18T12:00:00.000Z"
    }
  ]
  ```
