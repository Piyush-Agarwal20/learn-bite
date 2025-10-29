#!/usr/bin/env node

/**
 * Test Database Connection
 *
 * Quick test to verify your credentials are working correctly.
 * Run: node scripts/test-connection.js
 */

import dbManager from './db-manager/index.js';

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');
  console.log('═'.repeat(60));

  try {
    // Initialize
    dbManager.initialize();

    // Test 1: PostgreSQL Connection
    console.log('\n📡 Test 1: PostgreSQL Direct Connection');
    console.log('─'.repeat(60));

    const sqlTest = await dbManager.executeSQL('SELECT version()');
    if (sqlTest.success) {
      console.log('✅ PostgreSQL connection successful!');
      console.log(`📊 Database version: ${sqlTest.data[0].version.split(' ').slice(0, 2).join(' ')}`);
    } else {
      console.log('❌ PostgreSQL connection failed');
      console.log(`   Error: ${sqlTest.error}`);
    }

    // Test 2: List Tables
    console.log('\n📡 Test 2: Query Database Tables');
    console.log('─'.repeat(60));

    const tablesResult = await dbManager.listTables();
    if (tablesResult.success) {
      console.log(`✅ Found ${tablesResult.data.length} tables in database`);
    } else {
      console.log('❌ Failed to list tables');
    }

    // Test 3: Query Sample Data
    console.log('\n📡 Test 3: Query Sample Data');
    console.log('─'.repeat(60));

    const dataTest = await dbManager.executeSQL('SELECT COUNT(*) as count FROM topics');
    if (dataTest.success) {
      console.log('✅ Data query successful!');
      console.log(`📊 Topics in database: ${dataTest.data[0].count}`);
    } else {
      console.log('❌ Data query failed');
      console.log(`   Error: ${dataTest.error}`);
    }

    // Test 4: Check Privileges
    console.log('\n📡 Test 4: Check User Privileges');
    console.log('─'.repeat(60));

    const privTest = await dbManager.executeSQL(`
      SELECT current_user, current_database();
    `);
    if (privTest.success) {
      console.log('✅ User privileges verified!');
      console.log(`👤 Connected as: ${privTest.data[0].current_user}`);
      console.log(`🗄️  Database: ${privTest.data[0].current_database}`);
    }

    console.log('\n═'.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('═'.repeat(60));
    console.log('\n✨ Your database connection is fully configured!');
    console.log('   You now have Lovable-style automation capabilities.\n');
    console.log('📚 Next steps:');
    console.log('   • Try: node scripts/db-manager/examples.js');
    console.log('   • Try: node scripts/db-manager/cli.js list');
    console.log('   • Read: scripts/db-manager/README.md\n');

  } catch (error) {
    console.log('\n═'.repeat(60));
    console.log('❌ CONNECTION TEST FAILED');
    console.log('═'.repeat(60));
    console.log(`\nError: ${error.message}\n`);

    if (error.message.includes('not initialized')) {
      console.log('💡 Solution:');
      console.log('   1. Open .env file');
      console.log('   2. Add your credentials:');
      console.log('      SUPABASE_DB_PASSWORD=your_password');
      console.log('      SUPABASE_SERVICE_ROLE_KEY=your_key');
      console.log('   3. Run this test again\n');
      console.log('📖 See scripts/db-manager/README.md for detailed instructions\n');
    }
  } finally {
    await dbManager.close();
  }
}

testConnection().catch(console.error);
