import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function executeSQLDirect(sql) {
  // Use Supabase Admin API to execute SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql });
  return { data, error };
}

async function applyMigrations() {
  console.log('📦 Applying migrations directly...\n');

  // Migration 1: Bookmarks
  console.log('📄 Creating lesson_bookmarks table...');
  const bookmarksSql = fs.readFileSync('supabase/migrations/20241030000001_add_bookmarks.sql', 'utf8');

  // Try to create table directly
  const createBookmarks = `
    CREATE TABLE IF NOT EXISTS lesson_bookmarks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, lesson_id)
    );
  `;

  const { error: createError } = await supabase.from('lesson_bookmarks').select('id').limit(1);

  if (createError && createError.code === 'PGRST204') {
    console.log('  Table does not exist, needs manual creation');
    console.log('  ❌ Cannot create tables via API for security reasons');
  } else if (createError) {
    console.log('  ❌ Error:', createError.message);
  } else {
    console.log('  ✅ Table already exists!');
  }

  // Migration 2: Notes
  console.log('\n📄 Creating lesson_notes table...');
  const { error: notesError } = await supabase.from('lesson_notes').select('id').limit(1);

  if (notesError && notesError.code === 'PGRST204') {
    console.log('  Table does not exist, needs manual creation');
    console.log('  ❌ Cannot create tables via API for security reasons');
  } else if (notesError) {
    console.log('  ❌ Error:', notesError.message);
  } else {
    console.log('  ✅ Table already exists!');
  }

  console.log('\n📝 MANUAL ACTION REQUIRED:');
  console.log('   Supabase does not allow table creation via API');
  console.log('   Please run the SQL migrations in Supabase Dashboard');
  console.log('   See MANUAL_MIGRATION_STEPS.md for instructions');
}

applyMigrations()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
