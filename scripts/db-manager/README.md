# Database Manager - Lovable-Style Automation

This database manager provides **full programmatic control** over your Supabase database, just like Lovable.dev does. Create tables, run migrations, deploy functions, and execute raw SQL - all from code!

## Features

- **Direct PostgreSQL Access**: Execute any SQL command with superuser privileges
- **Supabase Admin Client**: Use service_role key for admin operations
- **Table Management**: Create, modify, and drop tables programmatically
- **Migration Runner**: Run SQL migration files automatically
- **RPC Functions**: Call custom PostgreSQL functions
- **CLI Tool**: Interactive command-line interface

## Setup

### 1. Get Your Credentials

You need two credentials for full access:

#### Database Password (postgres role)
1. Go to Supabase Dashboard → **Settings → Database**
2. Scroll to **"Connection string"** section
3. Click **"URI"** tab
4. Toggle **"Use connection pooling"** to **OFF**
5. Copy the password from the connection string:
   ```
   postgresql://postgres:[YOUR_PASSWORD_HERE]@db.rvmgfwdqjnmwixxjqcrz...
   ```

#### Service Role Key
1. Go to Supabase Dashboard → **Settings → API**
2. Scroll to **"Project API keys"** section
3. Find **"service_role"** key (marked as "secret")
4. Click **"Reveal"** button
5. Copy the entire JWT token

### 2. Add to .env

Open `.env` and add your credentials:

```env
SUPABASE_DB_PASSWORD=your_database_password_here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_token_here
```

### 3. Verify Installation

```bash
# Test the connection
node scripts/db-manager/examples.js
```

## Usage

### Programmatic API

```javascript
import dbManager from './scripts/db-manager/index.js';

// Initialize connections
dbManager.initialize();

// Create a table
await dbManager.createTable('my_table', {
  id: 'SERIAL PRIMARY KEY',
  name: 'VARCHAR(255) NOT NULL',
  created_at: 'TIMESTAMP DEFAULT NOW()'
});

// Execute raw SQL
const result = await dbManager.executeSQL(`
  SELECT * FROM topics WHERE category = 'Programming'
`);

// Run a migration
await dbManager.runMigration('supabase/migrations/add_new_features.sql');

// Add a column
await dbManager.addColumn('topics', 'priority', 'INTEGER', '0');

// Drop a table
await dbManager.dropTable('old_table');

// Close connections
await dbManager.close();
```

### CLI Commands

```bash
# List all tables
node scripts/db-manager/cli.js list

# Show table structure
node scripts/db-manager/cli.js info topics

# Execute SQL query
node scripts/db-manager/cli.js sql "SELECT * FROM topics LIMIT 5"

# Run migration file
node scripts/db-manager/cli.js migrate supabase/migrations/new_schema.sql

# Drop table
node scripts/db-manager/cli.js drop old_table

# Show help
node scripts/db-manager/cli.js help
```

## Available Functions

### Connection Management
- `initialize()` - Initialize PostgreSQL and Supabase connections
- `close()` - Close all database connections

### SQL Operations
- `executeSQL(sql)` - Execute any raw SQL command
- `runMigration(filePath)` - Run SQL migration file

### Table Management
- `createTable(tableName, schema)` - Create new table
- `dropTable(tableName)` - Drop table with CASCADE
- `addColumn(tableName, columnName, type, defaultValue)` - Add column to table
- `listTables()` - List all tables in database
- `getTableInfo(tableName)` - Show table structure and columns

### Supabase Admin
- `callRPC(functionName, params)` - Call custom RPC function

## Examples

### Create a Complex Table

```javascript
await dbManager.createTable('user_progress', {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  user_id: 'UUID REFERENCES auth.users(id) ON DELETE CASCADE',
  lesson_id: 'UUID REFERENCES lessons(id) ON DELETE CASCADE',
  status: "VARCHAR(50) DEFAULT 'not_started'",
  score: 'INTEGER DEFAULT 0',
  completed_at: 'TIMESTAMP',
  created_at: 'TIMESTAMP DEFAULT NOW()',
  updated_at: 'TIMESTAMP DEFAULT NOW()',
  'UNIQUE': '(user_id, lesson_id)'
});
```

### Run Complex Query

```javascript
const result = await dbManager.executeSQL(`
  SELECT
    t.title,
    COUNT(l.id) as lesson_count,
    AVG(l.estimated_time) as avg_time
  FROM topics t
  LEFT JOIN lessons l ON l.topic_id = t.id
  GROUP BY t.id, t.title
  ORDER BY lesson_count DESC;
`);

console.table(result.data);
```

### Create Migration File

```javascript
// Create file: supabase/migrations/add_tags_system.sql
await dbManager.runMigration('supabase/migrations/add_tags_system.sql');
```

## Security Notes

- **Be careful with .env** - It now contains sensitive credentials
- **Database password** gives full superuser access
- **Service role key** bypasses Row Level Security (RLS)
- Only use these credentials in development/trusted environments
- For production, use environment variables and secret management

## Comparison with Manual Work

### Before (Manual)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste SQL code
4. Click "Run"
5. Check for errors
6. Repeat for each change

### After (Automated)
```javascript
// Just code it!
await dbManager.createTable('new_table', schema);
await dbManager.runMigration('add_features.sql');
```

## Troubleshooting

### "PostgreSQL connection not initialized"
- Make sure `SUPABASE_DB_PASSWORD` is set in `.env.local`
- Verify password is correct from Supabase Dashboard

### "Supabase Admin not initialized"
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Verify key is the service_role key (not anon key)

### Connection timeout
- Check your internet connection
- Verify Supabase project is online
- Try using connection pooling URL if direct connection fails

## What's Next?

Now you can:
- ✅ Create tables directly from code
- ✅ Run migrations automatically
- ✅ Execute any SQL command
- ✅ Deploy schema changes without manual work
- ✅ Build automation scripts like Lovable.dev does

Just like Lovable, you now have full programmatic control over your database!
