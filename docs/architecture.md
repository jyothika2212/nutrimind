# System Architecture & Database Design - NutriMind AI

This document maps out the system diagrams, architectural data flows, and database schemas for the NutriMind AI Nutrition & Wellness platform.

---

## 1. System Architecture Diagram

The platform utilizes a structured MERN Stack architecture where client interactions occur over HTTP REST endpoints, while messaging operates on Socket.io tunnels.

```mermaid
graph TD
    Client[React Frontend - Vite/TS] <-->|HTTP REST / JSON| Express[Express Gateway API]
    Client <-->|WebSockets - Socket.io| Express
    Express -->|Query/Write| Mongoose[Mongoose ODM]
    Mongoose <-->|Data Sync| Atlas[(MongoDB Atlas Database)]
    Express -->|Generative Prompts| Gemini[Google Gemini API]
    Express <-->|Session Caching| Redis[(Redis Cache Store)]
```

---

## 2. Entity-Relationship (ER) Schema

```mermaid
erDiagram
    User {
        ObjectId id
        String name
        String email
        String password
        String role
        Boolean isVerified
        Object dietitianDetails
        Object userDetails
    }
    Food {
        ObjectId id
        String name
        Number calories
        Number protein
        Number fat
        Number carbs
        String servingSize
        String category
    }
    Recipe {
        ObjectId id
        String name
        String[] ingredients
        String[] cookingSteps
        Number calories
        String cuisine
    }
    Progress {
        ObjectId id
        ObjectId userId
        String date
        Number waterIntake
        Number weight
        Number sleepDuration
        Object meals
        Object[] workouts
    }
    Appointment {
        ObjectId id
        ObjectId userId
        ObjectId dietitianId
        Date date
        String status
        String videoLink
    }
    ChatMessage {
        ObjectId id
        ObjectId chatId
        ObjectId senderId
        ObjectId recipientId
        String messageText
        Boolean isRead
    }

    User ||--o{ Progress : "logs health"
    User ||--o{ Appointment : "schedules slot"
    User ||--o{ ChatMessage : "sends messages"
    Progress ||--o{ Food : "embeds logs"
```

---

## 3. Real-Time Chat Sequence Flow

This sequence models the messaging flows between users and dietitian specialists via Socket.IO.

```mermaid
sequenceDiagram
    participant UserClient as Client React App
    participant Server as Socket.io Server
    participant DB as MongoDB
    participant DietitianClient as Specialist React App

    UserClient->>Server: join_room (chatId)
    DietitianClient->>Server: join_room (chatId)
    
    UserClient->>Server: send_message (messageText)
    Note over Server: Save to Database
    Server->>DB: Save ChatMessage model
    Server-->>DietitianClient: receive_message (broadcast)
    
    DietitianClient->>Server: typing (isTyping: true)
    Server-->>UserClient: user_typing (render status)
```
