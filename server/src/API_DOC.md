# Murmur Web Application API Documentation

**Prepared by:** Md Alauddin Mazumder  
**Base URL:** `http://localhost:3001/api`  
**Authentication:** Bearer Token required for all protected endpoints  
**Authorization Header:**
```
Authorization: Bearer <your_jwt_here>
```

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
    - [Register User](#register-user)
    - [Login User](#login-user)
    - [Get My Profile](#get-my-profile)
2. [Murmur Endpoints](#murmur-endpoints)
    - [Get Global Murmur Feed](#get-global-murmur-feed)
    - [Get Personalized Timeline](#get-personalized-timeline)
    - [Get Murmur Details](#get-murmur-details)
    - [Like a Murmur](#like-a-murmur)
    - [Unlike a Murmur](#unlike-a-murmur)
3. ["Me" Endpoints (Authenticated User Actions)](#me-endpoints-authenticated-user-actions)
    - [Create a Murmur](#create-a-murmur)
    - [Delete a Murmur](#delete-a-murmur)
4. [User Endpoints](#user-endpoints)
    - [Search for Users](#search-for-users)
    - [Get User Profile](#get-user-profile)
    - [Follow a User](#follow-a-user)
    - [Unfollow a User](#unfollow-a-user)
    - [Get Following List](#get-following-list)
    - [Get Followers List](#get-followers-list)
5. [Notification Endpoints](#notification-endpoints)
    - [Get My Notifications](#get-my-notifications)
    - [Mark Notification as Read](#mark-notification-as-read)
6. [Error Codes & Handling](#error-codes--handling)
7. [Best Practices](#best-practices)

---

## 1. Authentication Endpoints

### 1.1 Register User

- **Endpoint:** `POST /auth/register`
- **Description:** Registers a new user with a unique username and email. The password is securely hashed.
- **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Success Response (201 Created):**
    ```json
    {
      "id": 1,
      "username": "string",
      "email": "string",
      "createdAt": "2025-06-25T00:00:00.000Z",
      "updatedAt": "2025-06-25T00:00:00.000Z"
    }
    ```
- **Error Responses:**
    - `400 Bad Request`: Validation errors (e.g., short password, invalid email)
    - `409 Conflict`: Username or email already taken

### 1.2 Login User

- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates a user and returns a JWT.
- **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Success Response (200 OK):**
    ```json
    {
      "accessToken": "a.jwt.string"
    }
    ```
- **Error Responses:**
    - `401 Unauthorized`: Invalid credentials

### 1.3 Get My Profile

- **Endpoint:** `GET /auth/profile`
- **Description:** Retrieves the authenticated user’s basic JWT payload.
- **Auth Required:** Yes
- **Success Response (200 OK):**
    ```json
    {
      "userId": 1,
      "username": "testuser"
    }
    ```
- **Error Responses:**
    - `401 Unauthorized`: Token missing or invalid

---

## 2. Murmur Endpoints

### 2.1 Get Global Murmur Feed

- **Endpoint:** `GET /murmurs`
- **Auth Required:** Yes
- **Query Parameters (optional):**
    - `page` (integer, default: 1)
    - `limit` (integer, default: 10)
- **Success Response (200 OK):**
    ```json
    {
      "data": [
        {
          "id": 1,
          "text": "A murmur from some user.",
          "createdAt": "...",
          "user": { "id": 1, "username": "someuser" },
          "likeCount": 5,
          "isLikedByMe": true
        }
      ],
      "total": 100,
      "page": 1,
      "last_page": 10
    }
    ```

### 2.2 Get Personalized Timeline

- **Endpoint:** `GET /murmurs/timeline`
- **Auth Required:** Yes
- **Query Parameters (optional):**
    - `page` (integer, default: 1)
    - `limit` (integer, default: 10)
- **Success Response (200 OK):**  
  Returns paginated murmurs from the current user & followed users.

### 2.3 Get Murmur Details

- **Endpoint:** `GET /murmurs/:id`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): Murmur ID
- **Success Response (200 OK):**  
  Returns the murmur object with like data.
- **Error Responses:**
    - `404 Not Found`: Murmur does not exist

### 2.4 Like a Murmur

- **Endpoint:** `POST /murmurs/:id/like`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): Murmur ID
- **Success Response (204 No Content):**  
  Empty response body

### 2.5 Unlike a Murmur

- **Endpoint:** `DELETE /murmurs/:id/like`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): Murmur ID
- **Success Response (204 No Content):**  
  Empty response body

---

## 3. "Me" Endpoints (Authenticated User Actions)

### 3.1 Create a Murmur

- **Endpoint:** `POST /me/murmurs`
- **Auth Required:** Yes
- **Request Body:**
    ```json
    {
      "text": "string (max: 280)"
    }
    ```
- **Success Response (201 Created):**  
  Returns the new murmur object.

### 3.2 Delete a Murmur

- **Endpoint:** `DELETE /me/murmurs/:id`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): Murmur ID
- **Description:** Deletes a murmur only if the requesting user is the author.
- **Success Response (204 No Content):**  
  Empty response body
- **Error Responses:**
    - `403 Forbidden`: Not the author
    - `404 Not Found`: Murmur does not exist

---

## 4. User Endpoints

### 4.1 Search for Users

- **Endpoint:** `GET /users/search`
- **Auth Required:** Yes
- **Query Parameters:**
    - `q` (string): The search term for the username.
- **Success Response (200 OK):**
    ```json
    [
      { "id": 1, "username": "testuser1" },
      { "id": 5, "username": "testuser2" }
    ]
    ```

### 4.2 Get User Profile

- **Endpoint:** `GET /users/:id`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): User ID
- **Success Response (200 OK):**
    ```json
    {
      "id": 2,
      "username": "userJony",
      "createdAt": "...",
      "murmurs": [
        { "id": 5, "text": "This is user Jony's post.", "createdAt": "...", "likeCount": 1, "isLikedByMe": false }
      ],
      "followerCount": 1,
      "followingCount": 0,
      "isFollowing": true
    }
    ```
- **Error Responses:**
    - `404 Not Found`: User does not exist

### 4.3 Follow a User

- **Endpoint:** `POST /users/:id/follow`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): User ID
- **Success Response (204 No Content):**  
  Empty response body

### 4.4 Unfollow a User

- **Endpoint:** `DELETE /users/:id/follow`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): User ID
- **Success Response (204 No Content):**  
  Empty response body

### 4.5 Get Following List

- **Endpoint:** `GET /users/:id/following`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): The user ID whose "following" list to fetch.
- **Success Response (200 OK):**  
  Returns a list of users.

### 4.6 Get Followers List

- **Endpoint:** `GET /users/:id/followers`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): The user ID whose "followers" list to fetch.
- **Success Response (200 OK):**  
  Returns a list of users.

---

## 5. Notification Endpoints

### 5.1 Get My Notifications

- **Endpoint:** `GET /notifications`
- **Auth Required:** Yes
- **Description:** Fetches notifications for the logged-in user and their unread count.
- **Success Response (200 OK):**
    ```json
    {
      "notifications": [
        {
          "id": 1,
          "type": "new_murmur",
          "isRead": false,
          "createdAt": "...",
          "sender": { "username": "userJony" },
          "murmur": { "id": 5 }
        }
      ],
      "unreadCount": 1
    }
    ```

### 5.2 Mark Notification as Read

- **Endpoint:** `POST /notifications/:id/read`
- **Auth Required:** Yes
- **URL Parameters:**
    - `:id` (integer): Notification ID
- **Success Response (204 No Content):**  
  Empty response body

---

## 6. Error Codes & Handling

- **400 Bad Request:** Invalid input, validation error
- **401 Unauthorized:** Missing or invalid token, or login failure
- **403 Forbidden:** Action not permitted (e.g., deleting someone else’s murmur)
- **404 Not Found:** Resource does not exist
- **409 Conflict:** Duplicate username or email during registration

---

## 7. Best Practices

- Always use HTTPS in production.
- Store JWT securely on the client-side.
- Validate all inputs on client and server.
- Use appropriate HTTP status codes and error messages for troubleshooting.
- Paginate large data sets using the provided query params.
- Protect all sensitive endpoints with JWT-based authentication.

---

**Prepared by:**  
Md Alauddin Mazumder
