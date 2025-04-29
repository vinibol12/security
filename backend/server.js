const express = require('express');
const path = require('path');
const cors = require('cors');
const { createExpressMiddleware } = require('@trpc/server/adapters/express');
const { appRouter, createContext } = require('./trpc/router');

const app = express();
const port = 3000;

// Enable CORS for the React frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up the tRPC API endpoint
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`tRPC API available at http://localhost:${port}/api/trpc`);
});