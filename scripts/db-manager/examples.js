#!/usr/bin/env node

/**
 * Database Manager - Usage Examples
 *
 * This file demonstrates all the capabilities of the database manager.
 * Run: node scripts/db-manager/examples.js
 */

import dbManager from './index.js';

async function runExamples() {
  // Initialize connections
  dbManager.initialize();

  console.log('═'.repeat(60));
  console.log('DATABASE MANAGER - USAGE EXAMPLES');
  console.log('═'.repeat(60));
  console.log('');

  try {
    // Example 1: List all tables
    console.log('📚 EXAMPLE 1: List All Tables');
    console.log('─'.repeat(60));
    await dbManager.listTables();

    // Example 2: Get table structure
    console.log('📚 EXAMPLE 2: Get Table Structure');
    console.log('─'.repeat(60));
    await dbManager.getTableInfo('topics');

    // Example 3: Execute raw SQL query
    console.log('📚 EXAMPLE 3: Execute Raw SQL Query');
    console.log('─'.repeat(60));
    const topicsResult = await dbManager.executeSQL('SELECT id, title, category FROM topics LIMIT 3');
    if (topicsResult.success) {
      console.log('✅ Query executed successfully!');
      console.log('📊 Results:');
      console.table(topicsResult.data);
    }

    // Example 4: Create a new table
    console.log('📚 EXAMPLE 4: Create New Table');
    console.log('─'.repeat(60));
    await dbManager.createTable('test_table', {
      id: 'SERIAL PRIMARY KEY',
      name: 'VARCHAR(255) NOT NULL',
      description: 'TEXT',
      created_at: 'TIMESTAMP DEFAULT NOW()'
    });

    // Example 5: Add column to existing table
    console.log('📚 EXAMPLE 5: Add Column to Table');
    console.log('─'.repeat(60));
    await dbManager.addColumn('test_table', 'status', 'VARCHAR(50)', "'active'");

    // Example 6: Insert data
    console.log('📚 EXAMPLE 6: Insert Data');
    console.log('─'.repeat(60));
    const insertResult = await dbManager.executeSQL(`
      INSERT INTO test_table (name, description)
      VALUES ('Test Item', 'This is a test')
      RETURNING *;
    `);
    if (insertResult.success) {
      console.log('✅ Data inserted successfully!');
      console.table(insertResult.data);
    }

    // Example 7: Query the new table
    console.log('📚 EXAMPLE 7: Query New Table');
    console.log('─'.repeat(60));
    const queryResult = await dbManager.executeSQL('SELECT * FROM test_table');
    if (queryResult.success) {
      console.log('✅ Query successful!');
      console.table(queryResult.data);
    }

    // Example 8: Clean up - drop test table
    console.log('📚 EXAMPLE 8: Drop Test Table (Cleanup)');
    console.log('─'.repeat(60));
    await dbManager.dropTable('test_table');

    // Example 9: Run a migration file
    console.log('📚 EXAMPLE 9: Run Migration File');
    console.log('─'.repeat(60));
    console.log('To run a migration:');
    console.log('  await dbManager.runMigration("supabase/migrations/your_migration.sql")');
    console.log('');

    // Example 10: Call RPC function (if you have custom functions)
    console.log('📚 EXAMPLE 10: Call RPC Function');
    console.log('─'.repeat(60));
    console.log('To call a custom RPC function:');
    console.log('  await dbManager.callRPC("your_function_name", { param1: value1 })');
    console.log('');

    console.log('═'.repeat(60));
    console.log('✅ ALL EXAMPLES COMPLETED!');
    console.log('═'.repeat(60));
    console.log('');
    console.log('💡 Tips:');
    console.log('   • Use executeSQL() for any raw SQL operations');
    console.log('   • Use createTable() for programmatic table creation');
    console.log('   • Use runMigration() to run .sql migration files');
    console.log('   • Use callRPC() for custom Supabase functions');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await dbManager.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export default runExamples;
