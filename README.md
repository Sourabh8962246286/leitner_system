# Leitner System Revision Application

This project is a multi-user implementation of a Leitner system for spaced repetition learning. It is built with a NestJS backend and a vanilla JavaScript frontend, with a secure JWT-based authentication system.

## 1. Project Overview

The application allows users to register, log in, and manage their own private collection of flashcards. Each user's data (subjects, cards, tags) is completely isolated from other users.

The core logic follows the Leitner system:
- **Correctly answered cards** are moved to the next box (level n+1).
- **Incorrectly answered cards** are moved back to the first box (level 1).

### Box Structure
The application is configured with 5 boxes, each with a different review cadence:
- **Box 1:** Everyday
- **Box 2:** Every Tuesday and Thursday
- **Box 3:** Every Saturday
- **Box 4:** Every other Saturday
- **Box 5:** First Sunday of the month

## 2. Architecture

### Backend
- **Framework:** NestJS
- **Authentication:** JWT-based authentication using Passport.js.
- **Database:** MongoDB with Mongoose for Object-Document Mapping.
- **Design:** The backend follows a modular design pattern to separate concerns.

#### Modules:
- **`AuthModule`**: Handles user registration, login (issuing access and refresh tokens), and token refreshing.
- **`UsersModule`**: Manages user creation and retrieval.
- **`DatabaseModule`**: Handles the connection to the MongoDB database.
- **`SubjectsModule`**: Manages creation, retrieval, and deletion of subjects for the authenticated user.
- **`BoxesModule`**: Manages the logic related to the Leitner boxes (shared across users).
- **`CardsModule`**: Manages all logic for cards for the authenticated user.
- **`TagsModule`**: Manages creation, retrieval, and deletion of tags for the authenticated user.

### Frontend
- **Technology:** Vanilla JavaScript, HTML5, and CSS3.
- **UI:** A single-page interface that dynamically renders a user's subjects, boxes, cards, and management forms. Includes separate pages for login and registration.
- **Features:**
    - Secure login and registration pages.
    - All API requests are authenticated using JWT.
    - Automatic redirect to login page if not authenticated.
    - Logout functionality.

## 3. API Structure

### Auth API (`/auth`)
- `POST /register`: Creates a new user. Requires `name`, `email`, `phoneNumber`, and `password`.
- `POST /login`: Authenticates a user and returns a JWT `access_token` and `refresh_token`.
- `POST /refresh`: Returns a new `access_token` using a valid `refresh_token`.

### Subjects API (`/subjects`) - Protected
- `GET /`: Retrieves all subjects for the authenticated user.
- `POST /`: Creates a new subject for the authenticated user.
- `DELETE /:id`: Deletes a subject owned by the authenticated user.

### Boxes API (`/boxes`) - Protected
- `GET /`: Retrieves all boxes, sorted by level.

### Cards API (`/cards`) - Protected
- `POST /`: Creates a new card for the authenticated user.
- `GET /`: Retrieves all cards for the authenticated user. Can be filtered.
- `PATCH /:id`: Updates a card owned by the authenticated user.
- `DELETE /:id`: Deletes a card owned by the authenticated user.
- `POST /review`: Handles a card review for the authenticated user.

### Tags API (`/tags`) - Protected
- `POST /`: Creates a new tag for the authenticated user.
- `GET /`: Retrieves all tags for the authenticated user. Can be filtered.
- `DELETE /:id`: Deletes a tag owned by the authenticated user.

## 4. Data Models

### User Schema (`user.schema.ts`)
- `name`: `String`
- `email`: `String` - Unique
- `phoneNumber`: `String` - Unique
- `password`: `String` - Hashed

### Subject Schema (`subject.schema.ts`)
- `name`: `String` - Unique per user.
- `userId`: `ObjectId` - Reference to the `User`.

### Box Schema (`box.schema.ts`)
- `title`: `String`
- `schedule`: `[String]`
- `level`: `Number`

### Card Schema (`card.schema.ts`)
- `front`: `String`
- `back`: `String`
- `subjectId`: `ObjectId`
- `currentBoxId`: `ObjectId`
- `lastReviewed`: `Date`
- `tags`: `[ObjectId]`
- `color`: `String`
- `userId`: `ObjectId` - Reference to the `User`.

### Tag Schema (`tag.schema.ts`)
- `name`: `String` - Unique per user and subject.
- `subjectId`: `ObjectId`
- `userId`: `ObjectId` - Reference to the `User`.

## 5. Setup and Running the Application

### Prerequisites
- Node.js & npm
- MongoDB
- `http-server` (or any other local web server for the frontend)

### Instructions
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create an environment file:**
    Create a file named `.env` in the `backend` directory and populate it with the following content. **Remember to change the secret keys.**
    ```
    # JWT
    JWT_ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-me
    JWT_ACCESS_TOKEN_EXPIRATION_TIME=1800
    JWT_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-me
    JWT_REFRESH_TOKEN_EXPIRATION_TIME=2592000

    # MongoDB
    MONGO_URI=mongodb://localhost/leitner-system
    ```
3.  **Install backend dependencies:**
    ```bash
    npm install
    ```
4.  **Seed the database (optional):**
    This will create the 5 default boxes.
    ```bash
    npm run seed
    ```
5.  **Start the backend server:**
    ```bash
    npm run start:dev
    ```
    The server will run on `http://localhost:3000`.

6.  **Serve the frontend:**
    From the **project root** directory (`leitnerApp`), run a local web server.
    ```bash
    # Install http-server if you haven't already
    # npm install -g http-server
    
    http-server .
    ```
7.  **Open the application in your browser:**
    Navigate to `http://localhost:8080` (or the URL provided by `http-server`). You will be directed to the login page.
