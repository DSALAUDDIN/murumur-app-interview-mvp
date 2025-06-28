# Murmur Web Application - Frontend Documentation

**Prepared by:** Md Alauddin Mazumder  
**Framework:** React 19 (with Vite)  
**Language:** TypeScript  
**Styling:** Inline CSS Objects

---

## Table of Contents

- [Getting Started](#1-getting-started)
- [Project Structure](#2-project-structure)
- [Core Architectural Concepts](#3-core-architectural-concepts)
  - [Routing](#31-routing)
  - [State Management (AuthContext)](#32-state-management-authcontext)
  - [API Service](#33-api-service)
- [Component & Page Breakdown](#4-component--page-breakdown)
  - [Pages](#pages)
  - [Reusable Components](#reusable-components)
- [Key Features & User Flows](#5-key-features--user-flows)

---

## 1. Getting Started

To run the frontend application in development mode:

1. **Navigate** to the root directory of the project.
2. **Install dependencies:**
   ```sh
   cd src && yarn install
   ```
3. **Run the development server:**
   ```sh
   yarn dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000) (or another port specified by Vite).  
   The `vite.config.ts` file is configured to proxy all `/api` requests to the backend server at `http://localhost:3001`.

---

## 2. Project Structure

The `/src` directory is organized to separate concerns, making the application scalable and maintainable.

```
/src
├── /components/      # Reusable UI components (Navbar, MurmurCard, etc.)
├── /context/         # React Context providers for global state (AuthContext)
├── /pages/           # Top-level components for each page/route
├── /services/        # Modules for communicating with external APIs (api.ts)
├── App.tsx           # Main application component, handles routing
├── main.tsx          # Entry point of the React application
└── index.css         # Global base styles
```

---

## 3. Core Architectural Concepts

### 3.1 Routing

- **Technology:** `react-router-dom v6`
- **Implementation:** Routing is managed in `App.tsx`. All page-level components are rendered through a `<Routes>` configuration.
- **Protected Routes:**  
  A custom `ProtectedRoute` component is used to guard routes that require authentication (e.g., Timeline, Profile).  
  If a user is not authenticated, this component automatically redirects them to the `/login` page.

### 3.2 State Management (AuthContext)

- **File:** `/src/context/AuthContext.tsx`
- **Purpose:** Provides a global, application-wide state for user authentication, avoiding the need to pass props through many levels of components ("prop drilling").
- **Components:**
  - **AuthProvider:** Wraps the entire application in `main.tsx`. Manages the authentication token and user ID.
  - **useAuth():** Custom hook for accessing auth state and actions:
    - `isAuthenticated` (`boolean`): True if a user is logged in
    - `userId` (`number | null`): The ID of the logged-in user
    - `token` (`string | null`): The raw JWT
    - `login(token)` (`function`): Saves the token to state and localStorage
    - `logout()` (`function`): Clears the token from state and localStorage

### 3.3 API Service

- **File:** `/src/services/api.ts`
- **Purpose:** Centralizes all communication with the backend API.
- **Implementation:**
  - An `axios` instance is created with the base URL `/api`, proxied by Vite.
  - An Axios request interceptor automatically attaches the `Authorization: Bearer <token>` header to every outgoing request if a token is present in localStorage.  
    This keeps component-level API calls clean and simple.

---

## 4. Component & Page Breakdown

### Pages

Located in `/src/pages/`:

- **LoginPage.tsx:** Handles user login.
- **RegisterPage.tsx:** Handles new user registration.
- **TimelinePage.tsx:** The main home page. Displays murmurs from the user and those they follow. Contains the form for creating new murmurs and handles pagination.
- **DiscoverPage.tsx:** Displays a global feed of all murmurs, allowing for user discovery.
- **ProfilePage.tsx:** Dynamic page for any user's profile, their murmurs, and follow stats. Conditionally renders "Follow/Unfollow" or "Delete" buttons based on user identity.
- **SearchPage.tsx:** Displays the results of a user search.
- **MurmurDetailPage.tsx:** Displays a single murmur and its details.
- **NotificationPage.tsx:** Displays a list of user notifications.

### Reusable Components

Located in `/src/components/`:

- **Navbar.tsx:** The main navigation bar. Conditionally renders links based on `isAuthenticated` state. Contains the search form and notifications component.
- **ProtectedRoute.tsx:** Wrapper that redirects unauthenticated users.
- **MurmurCard.tsx:** Displays a single murmur, including author, text, and interactive "Like" button.
- **CreateMurmurForm.tsx:** Form for posting new murmurs, including character count and validation.
- **Pagination.tsx:** UI component with "Previous" and "Next" buttons for paginated data.
- **FollowListModal.tsx:** Modal component used on the profile page to display lists of followers or following users.
- **Notifications.tsx:** Bell icon and dropdown component in the navbar that polls for and displays user notifications.

---

## 5. Key Features & User Flows

- **Optimistic UI Updates:**  
  For actions like "Liking" a post or "Following" a user, the UI updates instantly to feel responsive. The API call is made in the background. If the call fails, the UI reverts to its original state.

- **Centralized Styling:**  
  A design system object is used within each component to maintain a consistent theme (colors, fonts, spacing) via inline styles.

- **Comprehensive User Journey:**  
  The application supports the full social media lifecycle: registering, logging in, discovering users, following them, posting content, and interacting with that content.

---

**Prepared by:**  
Md Alauddin Mazumder
