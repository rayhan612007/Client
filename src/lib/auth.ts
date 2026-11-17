import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { createAuthMiddleware } from 'better-auth/api';

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI ?? 'mongodb://localhost:27017');
const db = client.db(process.env.MONGODB_DB ?? 'fixmate');

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  plugins: [jwt()],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'customer',
        input: true,
      },
      phone: { type: 'string', required: false, input: true },
      area: { type: 'string', required: false, input: true },
      bio: { type: 'string', required: false, input: true },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx: { path: string; body?: Record<string, unknown> }) => {
      // Only customer | technician are selectable at sign-up — force anything else to customer.
      if (ctx.path === '/sign-up/email' && ctx.body) {
        const body = ctx.body as Record<string, unknown>;
        return {
          body: {
            ...body,
            role: body.role === 'technician' ? 'technician' : 'customer',
          },
        };
      }
    }),
  },
});
