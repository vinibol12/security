# tRPC Demo Project

This project demonstrates a basic web application using React (with Vite) for the frontend and Express.js for the backend, with tRPC enabling type-safe API communication between them.

## Project Structure

```
security/
├── backend/        # Express server with tRPC implementation
│   ├── public/     # Static assets
│   ├── trpc/       # tRPC router and context
│   └── server.js   # Express server setup
└── frontend/       # React app using Vite
    └── src/        # Source code
        ├── trpc/   # tRPC client configuration
        └── App.jsx # React components using tRPC hooks
```

## Getting Started

### Running the Backend

```bash
cd backend
npm install
npm start
```

The server will start on port 3000 with tRPC endpoints available at http://localhost:3000/api/trpc.

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app will start on port 5173 and automatically connect to the backend's tRPC API.

## Features

This demo showcases two key tRPC features:

1. **Query** - Demonstrated with a greeting endpoint that accepts a name parameter
2. **Mutation** - Demonstrated with a counter endpoint that accepts increment/decrement actions

## Learning tRPC

This project is a minimal implementation showing how to:

- Set up a tRPC router on the backend
- Define procedures (queries and mutations)
- Validate inputs with Zod
- Configure a tRPC client on the frontend
- Use tRPC hooks in React components

For more detailed documentation, visit [tRPC's official documentation](https://trpc.io/docs)


# Understanding tRPC in Your Project

## What is tRPC?

tRPC (TypeScript Remote Procedure Call) is a framework that enables you to build **typesafe APIs** without the need for code generation or schemas. It creates a seamless connection between your backend and frontend, allowing you to call server functions directly from your client code with full type safety.

---

## Backend Implementation

### tRPC Router and Procedures

In your backend, the core of tRPC is implemented in `/backend/trpc/router.js`:

```js
const { initTRPC } = require('@trpc/server');
const { z } = require('zod');
const t = initTRPC.context().create();

// Base router and procedure helpers
const router = t.router;
const publicProcedure = t.procedure;
```

#### Main components:
- `initTRPC`: Initializes tRPC with your context
- `t.router`: Creates a router to define your API endpoints
- `t.procedure`: Defines the base procedure, which you can extend

### Procedure Types

tRPC supports different types of procedures:

#### Query Procedures (for retrieving data)

```js
greeting: publicProcedure
  .input(z.object({ name: z.string().optional() }).optional())
  .query(({ input }) => {
    // Implementation here
  }),
```

#### Mutation Procedures (for modifying data)

```js
counter: publicProcedure
  .input(z.object({ action: z.enum(['increment', 'decrement']).optional() }))
  .mutation(({ input }) => {
    // Implementation here
  }),
```

> 🔔 Subscription procedures (for real-time data) are not implemented in this project.

### Procedure Chain

Each procedure follows a chainable pattern:

1. Start with a procedure type (`publicProcedure` or protected)
2. Add input validation with `.input(zodSchema)`
3. Define handler type: `.query()`, `.mutation()`, or `.subscription()`
4. Implement the handler: `({ input, ctx }) => { ... }`

### Context

Defined in `/backend/trpc/context.js`:

```js
const createContext = ({ req, res }) => {
  return {
    req,
    res,
  };
};
```

Used for:
- Database connections
- Authentication info
- Request/response access

### Express Integration

In `server.js`:

```js
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));
```

Creates the HTTP endpoints your frontend will call.

---

## Frontend Implementation

### Client Setup

In `/frontend/src/trpc/client.js`:

```js
import { createTRPCReact } from '@trpc/react-query';
export const trpc = createTRPCReact();
```

This creates React-specific hooks.

### Provider Setup

In `/frontend/src/trpc/provider.jsx`:

```jsx
const [queryClient] = useState(() => new QueryClient());

const [trpcClient] = useState(() =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc',
      }),
    ],
  })
);
```

#### Breakdown:
- `QueryClient`: From React Query, manages caching/state
- `trpc.createClient`: Communicates with the backend
- `httpBatchLink`: Batches requests into a single HTTP call

### Provider Integration

```jsx
<trpc.Provider client={trpcClient} queryClient={queryClient}>
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
</trpc.Provider>
```

Makes tRPC and React Query available to the app.

---

## Using tRPC in Components

### Queries (fetching data)

```jsx
const greeting = trpc.greeting.useQuery({ name: name || undefined });
```

### Mutations (changing data)

```jsx
const counterMutation = trpc.counter.useMutation();

// Usage:
counterMutation.mutate({ action: 'increment' });
```

Hooks provide loading states, error handling, and data.

---

## Clarifications

> **Why do we have a context and router in the `trpc` folder in the frontend?**

We don’t — not in the same way as the backend.

- `client.js`: Sets up React hooks
- `provider.jsx`: Initializes the tRPC client and React Query

The router is inferred from the backend using tRPC’s type inference.

---

## Benefits of tRPC

- ✅ **Type Safety**: End-to-end types
- 🚀 **Developer Experience**: Autocomplete for procedures
- 🛠 **No Code Generation**: Unlike GraphQL/OpenAPI
- 🪶 **Lightweight**: Minimal runtime code
- 🧠 **Simple Architecture**: Call backend functions directly from frontend

This simplifies full-stack TypeScript development and ensures strong consistency between backend and frontend.

