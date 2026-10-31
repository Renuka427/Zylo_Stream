import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'zylo_stream';

  console.log(`[InitDB] Connecting to MySQL at ${dbHost}:${dbPort} as ${dbUser}...`);

  try {
    const conn = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      multipleStatements: true
    });

    console.log(`[InitDB] Creating database "${dbName}" if not exists...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.query(`USE \`${dbName}\`;`);

    // Read and run schema.sql
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log(`[InitDB] Executing schema.sql...`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await conn.query(schemaSql);
      console.log(`[InitDB] Schema created successfully.`);
    }

    // Read and run seed.sql
    const seedPath = path.resolve(__dirname, '../../../database/seeds/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log(`[InitDB] Executing seed.sql...`);
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await conn.query(seedSql);
      console.log(`[InitDB] Seed records inserted successfully.`);
    }

    await conn.end();
    console.log(`[InitDB] Database setup and migrations finished cleanly.`);
    process.exit(0);
  } catch (err) {
    console.error(`[InitDB] Error initializing MySQL database:`, err.message);
    process.exit(1);
  }
}

run();
