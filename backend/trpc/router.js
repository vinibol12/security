const { initTRPC } = require('@trpc/server');
const { z } = require('zod');
const { createContext } = require('./context');

// Initialize tRPC
const t = initTRPC.context().create();

// Base router and procedure helpers
const router = t.router;
const publicProcedure = t.procedure;

// Create a simple router with a greeting procedure
const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(({ input }) => {
      const name = input?.name || 'World';
      return {
        greeting: `Hello ${name}!`,
        timestamp: new Date().toISOString()
      };
    }),
  
  counter: publicProcedure
    .input(z.object({ action: z.enum(['increment', 'decrement']).optional() }))
    .mutation(({ input }) => {
      // This would normally interact with a database or some state
      // For simplicity, just return a simulated response
      const action = input?.action || 'increment';
      return {
        action,
        message: `Counter ${action}ed successfully`,
        timestamp: new Date().toISOString()
      };
    })
});

// Export type definition of API
/**
 * @typedef {import('@trpc/server').Router} Router
 * @typedef {typeof appRouter} AppRouter
 */

module.exports = { appRouter, createContext };
