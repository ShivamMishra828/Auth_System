# Authentication System

This project is a basic authentication system built using Express, MongoDB. It provides functionalities for user signup, email verification, password reset, and user profile management.

## Features

-   **User Signup**: Register a new account with email, password, and username. A verification email is sent after registration.
-   **Email Verification**: Users must verify their email with an OTP sent to their email.
-   **Login**: Secure login with JWT token generation.
-   **Password Reset**: Forgot password functionality with email-based reset token.
-   **Protected Routes**: Access to certain routes is restricted to authenticated users (JWT protected).
-   **Fetch User Details**: Authenticated users can view their profile details.

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: JWT (JSON Web Tokens)
-   **Email Service**: Nodemailer for sending emails

## Project Structure

The project is organized as follows:

-   **`config/`**: Configuration files and settings.
-   **`controllers/`**: Handles request response processing.
-   **`middleware/`**: Custom middleware for authentication and request validation.
-   **`models/`**: Mongoose models for database interaction.
-   **`repository/`**: Data access layer for interacting with the database.
-   **`routes/`**: Defines application routes.
-   **`services/`**: Contains business logic and service interactions.
-   **`templates/`**: Email templates for verification and password reset.
-   **`utils/`**: Utility functions and classes for common operations.

## API Documentation

The API endpoints for this authentication system are documented and can be tested using the Postman collection. The Postman collection includes routes for authentication, such as signup, login, email verification, password reset, and more.

You can access and use the Postman collection here: [Postman Collection](https://www.postman.com/payload-technologist-76643940/workspace/assignment/collection/37961505-c3c77b1c-a779-4023-aca0-73cce3ec3841?action=share&creator=37961505&active-environment=37961505-5c23ad60-b79c-4015-b2a7-9bae3c77c093)

## Deployment

The authentication system is deployed on Render using the free tier. Please note that it may take some time to boot up a new instance of the machine. You can access the deployed application here: [Deployment Link](https://auth-system-j9sd.onrender.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ShivamMishra828/Auth_System.git
    cd Auth_System
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a .env file in the root directory and add the following environment variables:

    ```bash
    PORT=<your-port-number>
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    MAIL_HOST=<your-mail-host>
    MAIL_PORT=<your-mail-port>
    MAIL_USER=<your-mail-user>
    MAIL_PASS=<your-mail-password>
    ```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. The server will be running on http://localhost:**PORT-NUMBER**. You can modify the port in the configuration files if needed.

## API Endpoints

-   POST /api/v1/auth/signup: Create a new user account.
-   POST /api/v1/auth/verify-email: Verify user email with OTP.
-   POST /api/v1/auth/signin: Sign in a user.
-   GET /api/v1/auth/logout: Log out the user.
-   POST /api/v1/auth/forgot-password: Request a password reset link.
-   POST /api/v1/auth/reset-password/:resetToken: Reset the user password using the provided reset token.
-   GET /api/v1/profile: Fetch user details (requires authentication).
