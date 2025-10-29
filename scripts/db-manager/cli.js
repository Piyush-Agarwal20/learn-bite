#!/usr/bin/env node

/**
 * Database Manager CLI - Interactive command-line interface
 * Usage: node scripts/db-manager/cli.js [command] [args]
 */

import dbManager from './index.js';

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  dbManager.initialize();

  try {
    switch (command) {
      case 'list':
        await dbManager.listTables();
        break;

      case 'info':
        if (!args[0]) {
          console.log('❌ Please provide table name: node cli.js info <table_name>');
          process.exit(1);
        }
        await dbManager.getTableInfo(args[0]);
        break;

      case 'create':
        if (!args[0]) {
          console.log('❌ Please provide table name: node cli.js create <table_name>');
          process.exit(1);
        }
        console.log('⚠️  Use createTable() function programmatically for table creation');
        break;

      case 'drop':
        if (!args[0]) {
          console.log('❌ Please provide table name: node cli.js drop <table_name>');
          process.exit(1);
        }
        await dbManager.dropTable(args[0]);
        break;

      case 'migrate':
        if (!args[0]) {
          console.log('❌ Please provide migration file path: node cli.js migrate <file_path>');
          process.exit(1);
        }
        await dbManager.runMigration(args[0]);
        break;

      case 'sql':
        if (!args[0]) {
          console.log('❌ Please provide SQL query: node cli.js sql "SELECT * FROM topics"');
          process.exit(1);
        }
        const result = await dbManager.executeSQL(args[0]);
        if (result.success) {
          console.log('✅ Query executed successfully!');
          console.log(`📊 Rows affected: ${result.rowCount}`);
          if (result.data && result.data.length > 0) {
            console.log('\n📋 Results:');
            console.table(result.data);
          }
        } else {
          console.log(`❌ Query failed: ${result.error}`);
        }
        break;

      case 'help':
      default:
        console.log(`
📚 Database Manager CLI

Usage: node scripts/db-manager/cli.js [command] [args]

Commands:
  list                    List all tables in database
  info <table_name>       Show table structure and columns
  drop <table_name>       Drop a table (use with caution!)
  migrate <file_path>     Run a migration file
  sql "<query>"           Execute raw SQL query
  help                    Show this help message

Examples:
  node scripts/db-manager/cli.js list
  node scripts/db-manager/cli.js info topics
  node scripts/db-manager/cli.js migrate supabase/migrations/add_new_table.sql
  node scripts/db-manager/cli.js sql "SELECT * FROM topics LIMIT 5"

Environment Variables Required:
  SUPABASE_DB_PASSWORD         Database password for direct PostgreSQL access
  SUPABASE_SERVICE_ROLE_KEY    Service role key for admin operations

Add these to your .env.local file.
        `);
        break;
    }
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    await dbManager.close();
  }
}

main();
