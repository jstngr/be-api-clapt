# Clapt Backend API

Backend API server for the Clapt real-time communication platform.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL (v14 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (if it exists) or create a new `.env` file
   - Update the following variables in `.env`:
     ```
     DATABASE_URL="postgresql://postgres:your_password@localhost:5432/clapt_db"
     FRONTEND_URL="http://localhost:5173"
     RESEND_API_KEY="your_resend_api_key"
     FIREBASE_PROJECT_ID="your_firebase_project_id"
     FIREBASE_CLIENT_EMAIL="your_firebase_client_email"
     FIREBASE_PRIVATE_KEY="your_firebase_private_key"
     UPSTASH_REDIS_URL="your_upstash_redis_url"
     UPSTASH_REDIS_TOKEN="your_upstash_redis_token"
     ```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

## Running the Application

To start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Development Notes

- The API uses WebSocket for real-time communication
- Make sure PostgreSQL is running before starting the server
- The server expects the frontend to be running at `http://localhost:5173`
