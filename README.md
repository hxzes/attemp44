# WisePicks Backend

Backend API for WisePicks, a sports betting tips platform with premium subscriptions.

## Features

- **Authentication & User Management**: Register, login, profile management
- **Betting Tips Management**: Public and premium tips
- **Premium Subscription**: Simple payment system for premium subscriptions
- **Notifications**: Real-time user notifications
- **User Dashboard**: Real-time data and statistics
- **Admin Panel**: User management, tips management, analytics
- **Real-Time Updates**: WebSocket integration for live updates

## Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)
- Socket.io (WebSockets)

## API Endpoints

### Authentication & User Management
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Log in user
- `GET /api/auth/me` - Get logged-in user profile
- `POST /api/auth/logout` - Invalidate session

### Betting Tips Management
- `GET /api/tips` - Fetch all public betting tips
- `POST /api/tips` - (Admin only) Add a new tip
- `DELETE /api/tips/:id` - (Admin only) Remove a tip

### Premium Subscription
- `POST /api/payment/checkout` - Start transaction, generate payment intent
- `GET /api/payment/status/:id` - Check payment status
- `POST /api/payment/confirm/:id` - Confirm payment (for testing/admin)

### Notifications
- `GET /api/notifications` - Fetch user-specific notifications
- `POST /api/notifications/mark-read` - Mark notification as read

### User Dashboard
- `GET /api/dashboard/user-data` - Fetch user dashboard data
- `POST /api/dashboard/bankroll` - Update bankroll
- `POST /api/dashboard/bet` - Add bet to history
- `POST /api/dashboard/calculate` - Calculate betting profit

### Admin Panel
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:id/ban` - Ban user
- `POST /api/admin/users/:id/unban` - Unban user
- `PUT /api/admin/users/:id` - Update user details
- `POST /api/admin/users/:id/reset-password` - Reset user password
- `POST /api/admin/users/:id/premium` - Update user premium status
- `POST /api/admin/users/:id/remove-premium` - Remove user premium status

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the database schema: Execute `database/schema.sql` in your Supabase SQL editor
5. Start the server: `npm start`

## WebSocket Events

### Server to Client
- `new-tip` - New tip added
- `update-tip` - Tip updated
- `delete-tip` - Tip deleted
- `premium-status-updated` - User's premium status updated
- `new-notification` - New notification for user

### Client to Server
- `authenticate` - Authenticate WebSocket connection

## Payment System

The current implementation uses a simplified payment system:

1. User selects a subscription plan
2. Backend generates a payment intent
3. Frontend displays payment details
4. Admin or test endpoint confirms the payment
5. User's premium status is updated

In a production environment, you would integrate with a payment processor like Stripe, PayPal, or a cryptocurrency payment gateway.

## License

MIT

