# Leitner System Revision Application

This project is a simple, single-user implementation of a Leitner system for spaced repetition learning. It is built with a NestJS backend and a vanilla JavaScript frontend.

## 1. Project Overview

The application allows users to manage flashcards across a series of boxes. The core logic follows the Leitner system:
- **Correctly answered cards** are moved to the next box (level n+1).
- **Incorrectly answered cards** are moved back to the first box (level 1).

The system includes features for creating, editing, deleting, and tagging cards, as well as filtering cards by their tags.

## 2. Architecture

### Backend
- **Framework:** NestJS
- **Database:** MongoDB with Mongoose for Object-Document Mapping.
- **Design:** The backend follows a modular design pattern to separate concerns.

#### Modules:
- **`DatabaseModule`**: Handles the connection to the MongoDB database.
- **`BoxesModule`**: Manages the logic related to the Leitner boxes.
- **`CardsModule`**: Manages all logic for cards, including creation, review, updates, and association with tags.
- **`TagsModule`**: Manages the creation, retrieval, and deletion of tags.

### Frontend
- **Technology:** Vanilla JavaScript, HTML5, and CSS3.
- **UI:** A single-page interface that dynamically renders boxes, cards, and management forms.
- **Features:**
    - Drag-and-drop cards between boxes.
    - Click-to-review cards.
    - A modal form for creating new cards.
    - UI sections for managing tags and filtering cards.

## 3. API Structure

All endpoints are prefixed with the module name (e.g., `/cards`, `/boxes`, `/tags`).

### Boxes API (`/boxes`)
- `GET /`: Retrieves all boxes, sorted by level.

### Cards API (`/cards`)
- `POST /`: Creates a new card.
- `GET /`: Retrieves all cards. Can be filtered by tags via a query parameter (e.g., `?tags=id1,id2`).
- `PATCH /:id`: Updates the content (front, back, tags) of a specific card.
- `DELETE /:id`: Deletes a specific card.
- `POST /review`: Handles a card review, moving it to the appropriate box.

### Tags API (`/tags`)
- `POST /`: Creates a new tag.
- `GET /`: Retrieves all existing tags.
- `DELETE /:id`: Deletes a specific tag.

## 4. Data Models

### Box Schema (`box.schema.ts`)
- `title`: `String` - The name of the box (e.g., "Box 1").
- `schedule`: `[String]` - The review schedule (e.g., `['Everyday']`).
- `level`: `Number` - The level of the box, used to determine the sequence.

### Card Schema (`card.schema.ts`)
- `front`: `String` - The question or front side of the card.
- `back`: `String` - The answer or back side of the card.
- `currentBoxId`: `ObjectId` - A reference to the `Box` the card is currently in.
- `lastReviewed`: `Date` - The date the card was last reviewed.
- `tags`: `[ObjectId]` - An array of references to `Tag` documents.

### Tag Schema (`tag.schema.ts`)
- `name`: `String` - The unique name of the tag.

## 5. Setup and Running the Application

### Prerequisites
- Node.js
- npm
- MongoDB running on `mongodb://localhost/leitner-system`

### Instructions
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Seed the database (optional):**
    This will create 3 boxes and one sample card.
    ```bash
    npm run seed
    ```
4.  **Start the backend server:**
    ```bash
    npm run start:dev
    ```
    The server will run on `http://localhost:3000`.

5.  **Open the frontend:**
    Open the `index.html` file (in the project root) in your web browser.
