// Example Edge Function
// Deploy: supabase functions deploy hello

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createSupabaseClient } from '../_shared/supabase.ts';

serve(async (req) => {
  try {
    // Create Supabase client
    const supabase = createSupabaseClient(req);

    // Get user from auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Example: Fetch topics count
    const { count } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true });

    return new Response(
      JSON.stringify({
        message: 'Hello from Supabase Edge Function!',
        user: user?.email || 'anonymous',
        topics_count: count,
        timestamp: new Date().toISOString(),
      }),
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
