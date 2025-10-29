#!/usr/bin/env node

/**
 * Example: Create a table directly from code (Lovable-style)
 *
 * This demonstrates how you can now create tables programmatically
 * without ever opening the Supabase SQL Editor!
 */

import dbManager from './db-manager/index.js';

async function createExampleTable() {
  console.log('🚀 Creating a new table directly from code...\n');

  dbManager.initialize();

  try {
    // Create a new table for user notifications
    await dbManager.createTable('user_notifications', {
      id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
      user_id: 'UUID REFERENCES auth.users(id) ON DELETE CASCADE',
      title: 'VARCHAR(255) NOT NULL',
      message: 'TEXT NOT NULL',
      type: "VARCHAR(50) DEFAULT 'info'",
      is_read: 'BOOLEAN DEFAULT FALSE',
      created_at: 'TIMESTAMP DEFAULT NOW()'
    });

    // Verify it was created
    console.log('Verifying the table was created...\n');
    await dbManager.getTableInfo('user_notifications');

    // Insert some sample data
    console.log('📝 Inserting sample data...');
    const result = await dbManager.executeSQL(`
      INSERT INTO user_notifications (user_id, title, message, type)
      VALUES
        (gen_random_uuid(), 'Welcome!', 'Welcome to LearnBite', 'success'),
        (gen_random_uuid(), 'New Lesson', 'A new Python lesson is available', 'info')
      RETURNING *;
    `);

    if (result.success) {
      console.log('✅ Sample data inserted!');
      console.table(result.data);
    }

    // Query the data
    console.log('\n📊 Querying the new table...');
    const queryResult = await dbManager.executeSQL('SELECT * FROM user_notifications');
    if (queryResult.success) {
      console.log(`✅ Found ${queryResult.data.length} notifications`);
      console.table(queryResult.data);
    }

    console.log('\n🎉 SUCCESS! You just created a table directly from code!');
    console.log('   No Supabase SQL Editor needed!');
    console.log('   This is exactly how Lovable.dev works!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await dbManager.close();
  }
}

createExampleTable().catch(console.error);
