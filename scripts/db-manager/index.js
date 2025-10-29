#!/usr/bin/env node

/**
 * Database Manager - Lovable-style automation
 *
 * This provides full database control using both:
 * - PostgreSQL direct connection (database password)
 * - Supabase Admin client (service_role key)
 */

import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

// PostgreSQL connection
let pgPool = null;

// Supabase Admin client
let supabaseAdmin = null;

/**
 * Initialize connections
 */
export function initialize() {
  console.log('🔌 Initializing database connections...\n');

  // Initialize Supabase Admin
  if (SERVICE_ROLE_KEY) {
    supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase Admin client initialized');
  } else {
    console.log('⚠️  No SERVICE_ROLE_KEY found');
  }

  // Initialize PostgreSQL
  if (DB_PASSWORD) {
    const projectRef = 'rvmgfwdqjnmwixxjqcrz';
    // Try direct connection first (port 5432)
    const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`;

    pgPool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    console.log('✅ PostgreSQL connection pool initialized');
  } else {
    console.log('⚠️  No DB_PASSWORD found - PostgreSQL connection unavailable');
  }

  console.log('');
}

/**
 * Execute SQL directly via PostgreSQL
 */
export async function executeSQL(sql) {
  if (!pgPool) {
    throw new Error('PostgreSQL connection not initialized. Provide SUPABASE_DB_PASSWORD in .env.local');
  }

  try {
    const result = await pgPool.query(sql);
    return { success: true, data: result.rows, rowCount: result.rowCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create a table
 */
export async function createTable(tableName, schema) {
  console.log(`📋 Creating table: ${tableName}`);

  const columns = Object.entries(schema)
    .map(([name, type]) => `  ${name} ${type}`)
    .join(',\n');

  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n${columns}\n);`;

  const result = await executeSQL(sql);

  if (result.success) {
    console.log(`✅ Table ${tableName} created successfully!\n`);
  } else {
    console.log(`❌ Failed to create table: ${result.error}\n`);
  }

  return result;
}

/**
 * Drop a table
 */
export async function dropTable(tableName) {
  console.log(`🗑️  Dropping table: ${tableName}`);

  const sql = `DROP TABLE IF EXISTS ${tableName} CASCADE;`;
  const result = await executeSQL(sql);

  if (result.success) {
    console.log(`✅ Table ${tableName} dropped successfully!\n`);
  } else {
    console.log(`❌ Failed to drop table: ${result.error}\n`);
  }

  return result;
}

/**
 * Add column to table
 */
export async function addColumn(tableName, columnName, columnType, defaultValue = null) {
  console.log(`➕ Adding column ${columnName} to ${tableName}`);

  let sql = `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${columnType}`;

  if (defaultValue !== null) {
    sql += ` DEFAULT ${defaultValue}`;
  }

  sql += ';';

  const result = await executeSQL(sql);

  if (result.success) {
    console.log(`✅ Column added successfully!\n`);
  } else {
    console.log(`❌ Failed to add column: ${result.error}\n`);
  }

  return result;
}

/**
 * Run migration file
 */
export async function runMigration(filePath) {
  console.log(`📄 Running migration: ${filePath}`);

  const fullPath = join(process.cwd(), filePath);

  if (!existsSync(fullPath)) {
    console.log(`❌ Migration file not found: ${fullPath}\n`);
    return { success: false, error: 'File not found' };
  }

  const sql = readFileSync(fullPath, 'utf8');
  const result = await executeSQL(sql);

  if (result.success) {
    console.log(`✅ Migration completed successfully!\n`);
  } else {
    console.log(`❌ Migration failed: ${result.error}\n`);
  }

  return result;
}

/**
 * List all tables
 */
export async function listTables() {
  const sql = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;

  const result = await executeSQL(sql);

  if (result.success) {
    console.log('📊 Tables in database:');
    result.data.forEach((row, idx) => {
      console.log(`   ${idx + 1}. ${row.table_name}`);
    });
    console.log('');
  }

  return result;
}

/**
 * Call RPC function via Supabase Admin
 */
export async function callRPC(functionName, params = {}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase Admin not initialized. Provide SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  console.log(`📞 Calling RPC function: ${functionName}`);

  const { data, error } = await supabaseAdmin.rpc(functionName, params);

  if (error) {
    console.log(`❌ RPC call failed: ${error.message}\n`);
    return { success: false, error: error.message };
  }

  console.log(`✅ RPC call successful!\n`);
  return { success: true, data };
}

/**
 * Get table info
 */
export async function getTableInfo(tableName) {
  const sql = `
    SELECT
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = '${tableName}'
    ORDER BY ordinal_position;
  `;

  const result = await executeSQL(sql);

  if (result.success) {
    console.log(`📋 Table structure for: ${tableName}`);
    console.log('─'.repeat(60));
    result.data.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    console.log('');
  }

  return result;
}

/**
 * Close connections
 */
export async function close() {
  if (pgPool) {
    await pgPool.end();
    console.log('🔌 PostgreSQL connection closed');
  }
}

// Export all functions
export default {
  initialize,
  executeSQL,
  createTable,
  dropTable,
  addColumn,
  runMigration,
  listTables,
  callRPC,
  getTableInfo,
  close
};
