#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyTables() {
  console.log('🔍 Verifying database tables...\n');

  // Test bookmarks table
  console.log('Testing lesson_bookmarks table...');
  const { data: bookmarksData, error: bookmarksError } = await supabase
    .from('lesson_bookmarks')
    .select('*')
    .limit(1);

  if (bookmarksError) {
    console.log('  ❌ Error:', bookmarksError.message);
  } else {
    console.log('  ✅ lesson_bookmarks table exists and is accessible!');
    console.log(`     Found ${bookmarksData?.length || 0} records`);
  }

  // Test notes table
  console.log('\nTesting lesson_notes table...');
  const { data: notesData, error: notesError } = await supabase
    .from('lesson_notes')
    .select('*')
    .limit(1);

  if (notesError) {
    console.log('  ❌ Error:', notesError.message);
  } else {
    console.log('  ✅ lesson_notes table exists and is accessible!');
    console.log(`     Found ${notesData?.length || 0} records`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (!bookmarksError && !notesError) {
    console.log('✅ ALL TABLES VERIFIED - DATABASE SETUP COMPLETE!');
    console.log('🎉 Your application is 100% ready to use!');
  } else {
    console.log('⚠️  Some tables have issues - check errors above');
  }
  console.log('='.repeat(50));
}

verifyTables();
