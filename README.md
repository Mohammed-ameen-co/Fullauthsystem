# Full Authentication System (Backend)

A production-style backend authentication system built using Node.js, Express, and MongoDB.
This project focuses on implementing secure, scalable, and real-world authentication architecture using JWT-based access and refresh token strategy.

---

## Key Features

- User Signup & Login
- JWT Authentication (Access Token + Refresh Token flow)
- Refresh Token stored as httpOnly secure cookie
- Refresh Token hashing before database storage
- Session tracking with MongoDB
- Token revocation on logout
- Sliding session expiry mechanism
- Middleware-based route protection
- Rate limiting on sensitive routes
- Secure password hashing using bcrypt
- Modular and scalable folder structure

---

## Authentication Flow Overview

1. User logs in → receives short-lived Access Token
2. Refresh Token stored securely in httpOnly cookie
3. Access Token used for protected routes
4. On expiry → Refresh endpoint issues new Access Token
5. Logout → Refresh Token revoked from DB

This architecture prevents:

- Token reuse attacks
- XSS access to refresh token
- Unauthorized session persistence

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- cookie-parser

---

## Project Structure

src/
│-- controllers/
│-- middlewares/
│-- models/
│-- routes/
│-- services/
│-- index.js

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

---

## How to Run Locally

```bash
git clone https://github.com/Mohammed-ameen-co/Fullauthsystem.git
cd Fullauthsystem
npm install
npm run dev

Server runs on:
http://localhost:5000
```

---

## Security Considerations Implemented

- Refresh tokens are hashed before storing in DB
- httpOnly cookie prevents JavaScript access
- Token expiration handled properly
- Session invalidation on logout
- Rate limiting to prevent brute force attacks
- Environment variables used for sensitive data

---

## API Endpoints

### Authentication

| Method | Endpoint | Description                    |
| ------ | -------- | ------------------------------ |
| POST   | /signup  | Register new user (email)      |
| POST   | /login   | Login user (rate limited)      |
| POST   | /refresh | Generate new access token      |
| POST   | /logout  | Revoke current session         |
| GET    | /me      | Get current authenticated user |

---

### Phone Authentication

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | /phone/request | Request OTP for phone login |
| POST   | /phone/verify  | Verify phone OTP            |

---

### Email Verification

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | /verify/request | Send verification token    |
| POST   | /verify/confirm | Confirm verification token |

---

### Password Management

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | /forgot-password | Generate reset token            |
| POST   | /reset-password  | Reset password using token      |
| POST   | /change-password | Change password (authenticated) |

---

### Protected Route Example

| Method | Endpoint | Description                      |
| ------ | -------- | -------------------------------- |
| GET    | /        | Protected + verified access only |

## Learning Outcomes

- Deep understanding of JWT-based authentication
- Designing secure token lifecycle management
- Middleware chaining & route protection
- Backend architecture structuring
- Handling edge cases like token reuse & expiration

---

## Future Enhancements

- Role-based access control (RBAC)
- OAuth integration (Google / GitHub)
- Two-factor authentication (2FA)

---

## Author

Ameen Rangrej
Aspiring Backend Developer (MERN Stack)

If you find this project useful, feel free to star the repository!
