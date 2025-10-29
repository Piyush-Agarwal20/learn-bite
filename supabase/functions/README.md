# Edge Functions - Deployment Guide

## Overview

Edge Functions are serverless TypeScript functions that run on Supabase's global edge network. They allow you to execute custom server-side logic close to your users.

## Current Functions

### 1. `hello`
- **Purpose**: Example edge function that demonstrates authentication and database access
- **Features**:
  - Gets authenticated user from JWT token
  - Queries topics count from database
  - Returns JSON response with user info and data

## Deployment

### Prerequisites

1. **Supabase CLI** - Already installed ✓
2. **Personal Access Token** - Required for deployment

### Getting Your Access Token

To deploy edge functions programmatically, you need a Personal Access Token:

1. Go to [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens)
2. Click **"Generate New Token"**
3. Give it a name: `LearnBite Deploy`
4. **Copy the token** (starts with `sbp_`)
5. Add to your `.env` file:
   ```env
   SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxx
   ```

### Deploy a Function

**Option 1: Using the deployment script (Recommended)**
```bash
# Deploy hello function
./scripts/deploy-edge-function.sh hello

# Deploy another function
./scripts/deploy-edge-function.sh my-function
```

**Option 2: Using Supabase CLI directly**
```bash
# Make sure CLI is in PATH
export PATH="$HOME/.local/bin:$PATH"

# Deploy a function
supabase functions deploy hello --project-ref rvmgfwdqjnmwixxjqcrz
```

### After Deployment

Your function will be available at:
```
https://rvmgfwdqjnmwixxjqcrz.supabase.co/functions/v1/{function-name}
```

For example, the `hello` function:
```
https://rvmgfwdqjnmwixxjqcrz.supabase.co/functions/v1/hello
```

## Testing Edge Functions

### Using cURL

**Without authentication:**
```bash
curl https://rvmgfwdqjnmwixxjqcrz.supabase.co/functions/v1/hello
```

**With authentication:**
```bash
curl https://rvmgfwdqjnmwixxjqcrz.supabase.co/functions/v1/hello \
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN"
```

**With anon key (from frontend):**
```bash
curl https://rvmgfwdqjnmwixxjqcrz.supabase.co/functions/v1/hello \
  -H "apikey: YOUR_ANON_KEY"
```

### From JavaScript/TypeScript

```typescript
import { supabase } from './supabase';

// Call edge function
const { data, error } = await supabase.functions.invoke('hello', {
  body: { name: 'World' }
});

if (error) {
  console.error('Error:', error);
} else {
  console.log('Response:', data);
}
```

## Creating New Edge Functions

### Step 1: Create the function directory

```bash
mkdir -p supabase/functions/my-function
```

### Step 2: Create index.ts

```typescript
// supabase/functions/my-function/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createSupabaseClient } from '../_shared/supabase.ts';

serve(async (req) => {
  try {
    const supabase = createSupabaseClient(req);

    // Your logic here
    const { data } = await supabase
      .from('your_table')
      .select('*');

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
```

### Step 3: Deploy

```bash
./scripts/deploy-edge-function.sh my-function
```

## Common Use Cases

### 1. Webhook Handler
Process incoming webhooks from external services (Stripe, GitHub, etc.)

### 2. Scheduled Tasks
Run background jobs on a schedule (with pg_cron)

### 3. Complex Business Logic
Handle complex operations that shouldn't run on the client

### 4. API Integrations
Call third-party APIs securely without exposing keys to the frontend

### 5. Email Sending
Send transactional emails using services like SendGrid or Resend

### 6. Image Processing
Resize, optimize, or transform images before storage

## Environment Variables

Edge functions can use environment secrets:

### Set a secret:
```bash
supabase secrets set MY_SECRET=value --project-ref rvmgfwdqjnmwixxjqcrz
```

### Use in function:
```typescript
const mySecret = Deno.env.get('MY_SECRET');
```

## Shared Code

The `_shared/` directory contains reusable code:

### `_shared/supabase.ts`
Helper to create authenticated Supabase client:
```typescript
import { createSupabaseClient } from '../_shared/supabase.ts';

const supabase = createSupabaseClient(req);
```

## Local Development

### Run functions locally:
```bash
supabase start
supabase functions serve hello --env-file .env
```

### Test locally:
```bash
curl http://localhost:54321/functions/v1/hello
```

## Best Practices

1. **Keep functions small** - Each function should do one thing well
2. **Use TypeScript** - Type safety prevents runtime errors
3. **Handle errors properly** - Always return proper error responses
4. **Use environment variables** - Never hardcode secrets
5. **Test locally first** - Use `supabase functions serve` for local testing
6. **Monitor logs** - Check function logs in Supabase Dashboard

## Troubleshooting

### "Access token not provided"
- Make sure `SUPABASE_ACCESS_TOKEN` is set in `.env`
- Get a new token from https://supabase.com/dashboard/account/tokens

### "Function not found"
- Ensure the function directory exists in `supabase/functions/`
- Check that `index.ts` exists in the function directory

### "Import error"
- Deno uses URLs for imports (not npm packages)
- Use https://deno.land/x/ for third-party modules

### "CORS errors"
- Add CORS headers to your response:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [Edge Function Examples](https://github.com/supabase/supabase/tree/master/examples/edge-functions)

## Summary

You now have **Lovable-style edge function deployment**! Just like database operations, you can deploy serverless functions directly from your terminal with a single command. No manual dashboard work required! 🚀
