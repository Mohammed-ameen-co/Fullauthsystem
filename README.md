# Full Authentication System (Backend)

A complete and secure backend authentication system built using **Node.js, Express, and MongoDB**.  
This project focuses on implementing real-world authentication practices with JWT and proper backend architecture.

---

## Features

- User Signup & Login
- JWT Authentication (Access & Refresh Tokens)
- Secure password hashing using bcrypt
- Logout functionality
- Basic rate limiting
- Clean and scalable backend structure

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- bcrypt
- dotenv

---

## Project Structure

```text
src/
│── controllers/
│── middlewares/
│── models/
│── routes/
│── services/
│── index.js
```

---

## Environment Variables

Create a `.env` file in the root directory and add the following:

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
```

Server will run on:
http://localhost:5000

---

## Learning Outcome

Through this project, I learned:
- How authentication works in real-world backend systems
- Implementing JWT access & refresh token flows
- Securing APIs with middleware
- Structuring scalable backend applications
- Best practices for handling sensitive data

---

## Future Improvements

- Email verification
- Forgot / Reset password
- Role-based access control
- OAuth (Google / GitHub)
- Two-factor authentication (2FA)

---

## Author

Ameen Rangrej  
Backend Developer (MERN Stack)

If you find this project useful, feel free to star the repository!
