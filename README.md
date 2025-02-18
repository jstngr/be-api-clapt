# Clapt Backend API

Backend API server for the Clapt real-time communication platform.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL (v14 or higher)

## Database Setup

1. Install PostgreSQL:
   - Windows: Download and install from [PostgreSQL Website](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. Start PostgreSQL service:
   - Windows: PostgreSQL service should start automatically
   - Mac: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. Create a new database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE clapt_db;

# Verify the database was created
\l

# Exit psql
\q
```

## Application Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (if it exists) or create a new `.env` file
   - Update the following variables in `.env`:
     ```
     # Database connection (update password as needed)
     DATABASE_URL="postgresql://postgres:your_password@localhost:5432/clapt_db"
     
     # Frontend URL
     FRONTEND_URL="http://localhost:5173"
     
     # JWT secret for authentication
     JWT_SECRET="your-secret-key-here"
     
     # Email service
     RESEND_API_KEY="your_resend_api_key"
     
     # Firebase (if using)
     FIREBASE_PROJECT_ID="your_firebase_project_id"
     FIREBASE_CLIENT_EMAIL="your_firebase_client_email"
     FIREBASE_PRIVATE_KEY="your_firebase_private_key"
     
     # Redis (if using)
     UPSTASH_REDIS_URL="your_upstash_redis_url"
     UPSTASH_REDIS_TOKEN="your_upstash_redis_token"
     ```

3. Set up the database schema:
```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma migrate dev --name init
```

4. (Optional) View your database with Prisma Studio:
```bash
npx prisma studio
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

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running:
   - Windows: Check Services app
   - Mac: `brew services list`
   - Linux: `sudo systemctl status postgresql`

2. Common connection issues:
   - Wrong password in DATABASE_URL
   - PostgreSQL not running
   - Wrong port number
   - Database doesn't exist

3. Reset PostgreSQL password:
```bash
psql -U postgres
\password
# Enter new password when prompted
```

### Migration Issues

If you encounter migration issues:
```bash
# Reset the database
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name init
```
