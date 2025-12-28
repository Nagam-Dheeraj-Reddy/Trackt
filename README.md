# Trackt
📦 Tractt

WarrantyVault is a full-stack web application that helps users securely store, track, and manage product warranties in one centralized dashboard.
It eliminates the risk of losing invoices or missing warranty expiry dates by providing status tracking and notifications.

🚀 Features
🔐 Authentication & User Management

User registration and login

JWT-based authentication

Secure password hashing

Forgot & reset password via email

Profile completion tracking

📋 Product & Warranty Management

Add products with:

Product image

Invoice / warranty card upload

Automatic warranty status calculation:

🟢 Active

⏳ Expiring Soon

❌ Expired

Detailed product view with download & preview

Delete products securely (owner-only access)

📊 Dashboard

Summary cards:

Total products

Active

Expiring Soon

Expired

Product table with:

Search

Filters

Sorting by expiry date

Collapsible sidebar & top navigation

Dark / Light mode (saved in localStorage)

🔔 Notification System

Session-based notifications:

Expiring Soon

Expired Today

Newly Added Products

Notification bell with glow animation

Popup notification panel

Automatically clears on logout

🧭 Guided Usage

“How to Use” page with:

Step-by-step instructions

Visual walkthrough

Image zoom popups

Home page with:

Hero slider

Feature highlights

Blog section

🛠 Tech Stack
Frontend

HTML

CSS

Vanilla JavaScript

Backend

Node.js

Express.js

Database

MongoDB (Mongoose)

Other Integrations

Cloudinary – image & document uploads

Nodemailer – password reset emails

JWT – authentication

LocalStorage & SessionStorage – UI state & notifications

📁 Project Structure (Backend)
Backend/
  server.js
  package.json
  config/
    db.js
  controllers/
    authController.js
    dashboardController.js
    documentController.js
    productController.js
  middleware/
    authMiddleware.js
  models/
    User.js
    Product.js
    ResetToken.js
  public/
    home.html
    login.html
    register.html
    dashboard.html
    profile.html
    add-product.html
    product.html
    forgot-password.html
    reset-password.html
    howtouse.html
    Slider.js
    Images/
  routes/
    authRoutes.js
    productRoutes.js
  utils/
    calculateStatus.js
    cloudinary.js
    mailer.js

⚙️ Setup & Installation
1️⃣ Clone the Repository
git clone <your-repo-url>
cd Backend

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file inside Backend/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_URL=http://localhost:5000

4️⃣ Run the Server
node server.js
# or
npm start

🌐 Application Pages
Page	URL
Home	/home.html
Login	/login.html
Register	/register.html
Dashboard	/dashboard
Profile	/profile.html
Add Product	/add-product.html
Product Details	/product/:id
How to Use	/howtouse.html
🔐 Authentication Flow
Register

Page: register.html

Endpoint: POST /api/auth/register

Validations:

Email format

Strong password

Name length

Password hashed before storage

Login

Page: login.html

Endpoint: POST /api/auth/login

On success:

JWT issued

User info saved in localStorage

Forgot / Reset Password

Pages:

forgot-password.html

reset-password.html

Tokens stored securely in ResetToken collection

Email sent using Nodemailer

📊 Dashboard Details

Stats fetched via:

GET /api/products/stats

Product list via:

GET /api/products/list

Delete product:

DELETE /api/products/:id

Search, filters & sorting handled client-side

Profile completion popup shown if incomplete

🔔 Notification Rules

Stored per session using sessionStorage

Types:

Expiring Soon

Expired Today

Newly Added Product

Each product triggers only one notification per session

Cleared on logout

🧩 Backend Models
User

name

email (unique)

password (hashed)

mobileNumber

address

profileCompleted

timestamps

Product

userId

name

model

serialNumber

purchaseDate

expiryDate

warrantyPeriodMonths

warrantyUrl

productImageUrl

invoiceUrl

warrantyCardUrl

status

color

addedDate

timestamps

ResetToken

userId

token

expiresAt

🔗 API Routes Overview
Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

POST /api/auth/update-profile

POST /api/auth/forgot-password

POST /api/auth/reset-password

Products

GET /api/products/stats

GET /api/products/list

GET /api/products/product/:id

POST /api/products/add

DELETE /api/products/:id

📚 How to Understand This Project

Start with frontend pages (home → auth → dashboard)

Move to backend controllers

Study models and utilities

Finally review server.js and middleware

👨‍💻 Author

Nagam Dheeraj Reddy
B.Tech CSE | Full-Stack Developer
