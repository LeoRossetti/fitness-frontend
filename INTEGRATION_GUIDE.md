# Convex and Sentry Integration Guide

This project has been set up with **Convex** (as the database) and **Sentry** (for error monitoring) integration.

## 🚀 Quick Start

### 1. Set up Sentry

1. Go to [sentry.io](https://sentry.io) and create a new project
2. Choose "Next.js" as your platform
3. Copy your DSN from the project settings
4. Add it to your `.env.local` file:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=your_actual_sentry_dsn_here
   ```

### 2. Convex is Already Set Up!

Your Convex deployment is already configured:
- **Deployment URL**: `https://sensible-dog-789.convex.cloud`
- **Team**: leonardo-rossetti-francatto
- **Project**: fitness-app-52e91

### 3. Start Development

```bash
# Install dependencies (if not already done)
npm install

npx convex dev --once

# Start the development server
npm run dev

# In another terminal, start Convex development server
npm run convex:dev
```

## 📂 What's Been Added

### Convex Configuration

- **Schema**: `convex/schema.ts` - Defines your database tables
- **Functions**: 
  - `convex/users.ts` - User management functions
  - `convex/clients.ts` - Client management functions
  - `convex/workoutTemplates.ts` - Workout template functions
  - `convex/workoutSessions.ts` - Workout session functions

### Sentry Configuration

- **Client**: `sentry.client.config.ts` - Client-side error tracking
- **Server**: `sentry.server.config.ts` - Server-side error tracking
- **Edge**: `sentry.edge.config.ts` - Edge runtime error tracking
- **Next.js Config**: Updated `next.config.ts` with Sentry integration

### React Integration

- **ConvexProvider**: `src/components/providers/ConvexProvider.tsx`
- **ErrorBoundary**: `src/components/ErrorBoundary.tsx` with Sentry integration
- **Example Component**: `src/components/ConvexExample.tsx`

## 🧪 Testing the Integration

Visit `/test` in your browser to see:
1. **Convex in action**: Create users and see them stored/retrieved from the database
2. **Sentry in action**: Click the "Trigger Test Error" button to see error tracking

## 🗄️ Database Schema

Your fitness app has these tables:

- **users** - App users (trainers)
- **clients** - Fitness clients
- **workoutTemplates** - Reusable workout templates
- **workoutSessions** - Individual workout sessions
- **exercises** - Exercise library
- **measurements** - Progress tracking measurements
- **goals** - Client goals
- **calendarEvents** - Calendar/scheduling events

## 📝 How to Use Convex

### In React Components

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Query data
const users = useQuery(api.users.getAllUsers);

// Mutate data
const createUser = useMutation(api.users.createUser);

// Use in component
const handleCreate = async () => {
  await createUser({ email: "test@example.com", name: "Test User" });
};
```

### Available Functions

- `api.users.getAllUsers()` - Get all users
- `api.users.getUserByEmail(email)` - Get user by email
- `api.users.createUser({email, name, image?})` - Create new user
- `api.clients.getClientsByUser(userId)` - Get all clients for a user
- `api.clients.createClient({userId, name, email?, ...})` - Create new client
- And many more! Check the files in `convex/` folder

## 🚨 How to Use Sentry

### Automatic Error Tracking

Errors are automatically captured thanks to the configuration files.

### Manual Error Tracking

```tsx
import * as Sentry from "@sentry/nextjs";

// Capture exceptions
try {
  // Some code that might throw
} catch (error) {
  Sentry.captureException(error);
}

// Capture messages
Sentry.captureMessage("Something important happened", "info");

// Add context
Sentry.setUser({ id: "123", email: "user@example.com" });
Sentry.setTag("component", "UserForm");
```

### Error Boundary

The app is wrapped with an error boundary that will:
1. Catch React errors
2. Send them to Sentry
3. Show a user-friendly error page

## 🔧 Development Commands

```bash
# Start Next.js development server
npm run dev

# Start Convex development (run in separate terminal)
npm run convex:dev

# Deploy to Convex production
npm run convex:deploy

# Build for production
npm run build
```

## 🎯 Next Steps for Practice

1. **Try the test page**: Go to `/test` and create some users
2. **Trigger an error**: Click the error button to see Sentry in action
3. **Explore the schema**: Look at `convex/schema.ts` to understand the data structure
4. **Create new functions**: Add your own queries/mutations in the convex folder
5. **Build components**: Create React components that use Convex data
6. **Practice error handling**: Add try/catch blocks with Sentry reporting

## 🔍 Debugging Tips

- **Check Convex Dashboard**: Visit [dashboard.convex.dev](https://dashboard.convex.dev) to see your data
- **Check Sentry Dashboard**: Visit your Sentry project to see captured errors
- **Browser DevTools**: Check console for any errors
- **Network Tab**: See Convex API calls in the Network tab

## 📚 Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Next.js Documentation](https://nextjs.org/docs)

Happy coding! 🎉
