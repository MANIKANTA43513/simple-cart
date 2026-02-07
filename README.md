
🛒 Shopping Cart Application

ABCDE Ventures – Full Stack Assignment

📌 Overview

This project is a basic e-commerce web application that demonstrates the complete lifecycle of a shopping flow:

User Signup → Login (Single Device) → Add Items to Cart → Place Order → View Orders

The application consists of:

A Node.js + Express backend with MongoDB

A React (Vite) frontend

JWT-based authentication with single-device session enforcement

The goal is to keep the system simple, clean, and easy to understand while following real-world backend and frontend practices.

🎯 Key Features
✅ Authentication & Session Management

User signup and login using JWT

Single-device login restriction

A user can only be logged in on one device at a time

Token is stored in the database

Login is blocked if an active token already exists

Logout clears the token and allows re-login

✅ Shopping Flow

View all available items

Add items to a cart (one cart per user)

Convert cart into an order

View cart items and order history

✅ Secure API Design

Protected routes using authentication middleware

Token validation against database

Clear separation of concerns (models, routes, middleware)

🧠 Single-Device Login Logic (Important)

To ensure a user is logged in on only one device at a time, the following logic is used:

On successful login, a JWT token is generated.

The token is stored in the user’s database record.

If a login request is made and a token already exists:

Login is denied

Frontend shows:
“You cannot login on another device.”

On logout:

Token is removed from the database

User can log in again from any device

🏗️ Tech Stack
Backend

Node.js

Express.js

MongoDB

Mongoose

JWT (jsonwebtoken)

bcryptjs

dotenv

cors

Frontend

React (Vite)

Tailwind CSS

Axios

Lucide React (icons)

📂 Project Structure
shopping-cart-app
├── backend
│   ├── models
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── middleware
│   │   └── auth.js
│   ├── routes
│   │   ├── userRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Login.jsx
│   │   │   ├── ItemList.jsx
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
│
└── package.json

🔗 API Endpoints
User APIs
Method	Endpoint	Description
POST	/users	Create new user
GET	/users	List all users
POST	/users/login	Login user
POST	/users/logout	Logout user
Item APIs
Method	Endpoint	Description
POST	/items	Create an item
GET	/items	List all items
Cart APIs (Protected)
Method	Endpoint	Description
POST	/carts	Add item to cart
GET	/carts	List all carts

Token must be sent in the Authorization header.

Order APIs (Protected)
Method	Endpoint	Description
POST	/orders	Convert cart to order
GET	/orders	List all orders
🖥️ Frontend Flow
1️⃣ Login Screen

User enters username & password

On failure → window.alert("Invalid username/password")

If logged in elsewhere → alert shown

2️⃣ Item List Screen

Displays all items

Clicking an item adds it to the cart

3️⃣ Action Buttons

Checkout → Places order

Cart → Shows cart items in alert/toast

Order History → Shows order IDs in alert/toast

4️⃣ Checkout

Cart converts to order

Cart is cleared

Success message shown

User stays on Item List screen

⚙️ Environment Variables

Create a .env file inside /backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

🚀 How to Run the Project
Backend
cd backend
npm install
npm start

Frontend
cd frontend
npm install
npm run dev

🧪 Testing Notes

Manual testing using Postman for APIs

UI tested using browser interactions

Authentication and single-device logic verified

🧩 Assumptions Made

No inventory or stock management

Each user has only one cart

Cart is cleared after order placement

UI feedback shown using alerts/toasts for simplicity

✅ Conclusion

This project demonstrates:

Clean REST API design

Secure authentication

Real-world session control logic

Simple yet effective frontend integration

It serves as a strong foundation for a scalable e-commerce system
