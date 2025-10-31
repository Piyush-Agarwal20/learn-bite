#!/usr/bin/env node

import { initialize, executeSQL, close } from './db-manager/index.js';
import { readFileSync } from 'fs';

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  // Initialize connection
  initialize();

  try {
    // Migration 1: Bookmarks
    console.log('📄 Applying bookmarks migration...');
    const bookmarksSql = readFileSync('supabase/migrations/20241030000001_add_bookmarks.sql', 'utf8');
    await executeSQL(bookmarksSql);
    console.log('✅ Bookmarks migration applied\n');

    // Migration 2: Notes
    console.log('📄 Applying study notes migration...');
    const notesSql = readFileSync('supabase/migrations/20241030000002_add_study_notes.sql', 'utf8');
    await executeSQL(notesSql);
    console.log('✅ Study notes migration applied\n');

    console.log('🎉 All migrations completed successfully!\n');

    // Verify tables
    console.log('🔍 Verifying tables...');
    try {
      const verifyBookmarks = await executeSQL(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'lesson_bookmarks'
      `);
      console.log(`  ${verifyBookmarks?.rows?.length > 0 ? '✅' : '❌'} lesson_bookmarks table`);

      const verifyNotes = await executeSQL(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'lesson_notes'
      `);
      console.log(`  ${verifyNotes?.rows?.length > 0 ? '✅' : '❌'} lesson_notes table`);
    } catch (verifyError) {
      console.log('  ⚠️  Could not verify tables (but they should be created)');
    }

    console.log('\n✅ Database setup complete!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await close();
  }
}

runMigrations();
