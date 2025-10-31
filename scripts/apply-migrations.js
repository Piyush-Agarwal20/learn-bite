import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigrations() {
  console.log('📦 Applying database migrations...\n');

  const migrations = [
    { file: 'supabase/migrations/20241030000001_add_bookmarks.sql', name: 'Bookmarks' },
    { file: 'supabase/migrations/20241030000002_add_study_notes.sql', name: 'Study Notes' },
  ];

  for (const migration of migrations) {
    console.log(`\n📄 Processing ${migration.name} migration...`);
    const sql = fs.readFileSync(migration.file, 'utf8');

    // Split into statements and execute one by one
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`  Found ${statements.length} statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 60).replace(/\s+/g, ' ');

      try {
        // Try to execute via raw SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });

        if (error) {
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`  ⚪ ${i + 1}. ${preview}... (already exists)`);
          } else {
            console.log(`  ⚠️  ${i + 1}. ${preview}...`);
            console.log(`      Error: ${error.message}`);
          }
        } else {
          console.log(`  ✅ ${i + 1}. ${preview}...`);
        }
      } catch (err) {
        console.log(`  ⚠️  ${i + 1}. ${preview}...`);
        console.log(`      Error: ${err.message}`);
      }
    }
  }

  // Verify tables exist
  console.log('\n🔍 Verifying tables...');

  try {
    const { error: bookmarksError } = await supabase.from('lesson_bookmarks').select('id').limit(1);
    console.log(`  ${bookmarksError ? '❌' : '✅'} lesson_bookmarks table`);
    if (bookmarksError) console.log(`      ${bookmarksError.message}`);
  } catch (e) {
    console.log(`  ❌ lesson_bookmarks table - ${e.message}`);
  }

  try {
    const { error: notesError } = await supabase.from('lesson_notes').select('id').limit(1);
    console.log(`  ${notesError ? '❌' : '✅'} lesson_notes table`);
    if (notesError) console.log(`      ${notesError.message}`);
  } catch (e) {
    console.log(`  ❌ lesson_notes table - ${e.message}`);
  }

  console.log('\n✅ Migration script completed!');
  console.log('\n📝 If tables do not exist, please apply migrations manually:');
  console.log('   1. Go to Supabase Dashboard > SQL Editor');
  console.log('   2. Copy contents of supabase/migrations/20241030000001_add_bookmarks.sql');
  console.log('   3. Run the SQL');
  console.log('   4. Repeat for 20241030000002_add_study_notes.sql');
}

applyMigrations()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Fatal Error:', err.message);
    console.log('\n📝 Manual migration required via Supabase Dashboard');
    process.exit(1);
  });
