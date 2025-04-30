# Advance Booking System Backend

This project is a backend system for an advance booking platform, designed to handle user bookings for slots created by organizers. It features role-based access control with different roles like 'USER', 'ORGANIZER', and 'ADMIN'. The system allows users to book and cancel slots, while organizers can create and view their slots. The backend is built with Node.js, Express.js, MySQL, Prisma, and various other technologies.

## Tech Stack
- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for building the API.
- **MySQL**: Relational database for storing user and booking data.
- **Prisma**: ORM for interacting with MySQL.
- **Joi**: For validating input data.
- **Socket.io**: Real-time communication between users and organizers, enabling live booking and cancellation updates.
- **JWT (JSON Web Token)**: For secure authentication and authorization.
- **Cookies**: To manage session data and store tokens.

## Features
- **Role-Based Access Control**: Different access levels for:
  - **USER**: Can book and cancel slots.
  - **ORGANIZER**: Can create, view, and manage their slots.
  - **ADMIN**: Can manage all users and organizers.
- **User Authentication**: Login and signup system with JWT authentication.
- **Joi Validation**: Data validation for various API requests (e.g., signup, login, slot creation).
- **Booking System**: 
  - Users can view available slots and make bookings.
  - Users can view their past bookings.
  - Users can cancel their bookings.
- **Slot Management**: Organizers can create new slots, view their slots, and see booked slots.
- **Socket.io Integration**: Real-time communication for booking and cancellation events.

## Project Setup

### Prerequisites
- Node.js >= 14.0.0
- MySQL Database
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/advance-booking-system-backend.git](https://github.com/pratham07m/booking.co.git
   cd booking.co

2. Install dependencies:
   ```bash
   npm install
3. Set up MySQL Database
  - Create a MySQL database named booking_system.
  - Update the database credentials in .env file.
4. Set up Prisma
  - Install Prisma and generate the database schema
    ``` bash
    npx prisma migrate dev --name init

5.Run the server
 -   ``` bash
       npm run dev

### API Endpoints
POST /api/auth/signup: Create a new user account.

POST /api/auth/login: Login with credentials, returns JWT token.

POST /api/slots/createslots: Create a new slot (only for organizers).

GET /api/slots/all : Get all available slots (User route)

GET /api/bookslot/:bookingId: Get details of a specific slot.

POST /api/booking/book - user can book slot

GET /api/booking/my-bookings - get all user booked slot

DELET /api/booking/cancel/:bookingId - user can cancel the slot

GET /api/booking/bookings - organizers can see all bookings
