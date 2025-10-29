import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Starting API Debug Tests\n');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing');
console.log('');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Fetch Topics');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .limit(3);

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Details:', error);
    } else {
      console.log('✅ Topics fetched:', data.length);
      data.forEach((topic, i) => {
        console.log(`  ${i + 1}. ${topic.title} (${topic.category})`);
      });
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Fetch Lessons');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .limit(3);

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Lessons fetched:', data.length);
      data.forEach((lesson, i) => {
        console.log(`  ${i + 1}. ${lesson.title}`);
      });
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Fetch User Progress (Unauthenticated)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .limit(3);

    if (error) {
      console.log('❌ Error (expected for RLS):', error.message);
    } else {
      console.log('✅ User progress fetched:', data.length);
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 4: Check Profiles Table');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Profiles count:', count);
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 5: Test Topic Categories');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('category')
      .order('category');

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      const categories = [...new Set(data.map(item => item.category))];
      console.log('✅ Categories found:', categories.length);
      console.log('  Categories:', categories.join(', '));
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 6: Check Table Structures');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const tables = ['topics', 'lessons', 'user_progress', 'profiles'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        if (data && data.length > 0) {
          console.log(`✅ ${table}: Columns - ${Object.keys(data[0]).join(', ')}`);
        } else {
          console.log(`⚠️  ${table}: Empty table`);
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏁 Tests Complete');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

runTests().catch(console.error);
