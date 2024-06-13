import mysql, { PoolOptions } from 'mysql2/promise';

import dotenv from 'dotenv';
dotenv.config();

const dbConfig: PoolOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    waitForConnections: true,
    connectionLimit: 10,
    password:  process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

const pool = mysql.createPool(dbConfig);

export { pool };