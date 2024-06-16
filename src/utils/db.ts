//MongoDB 연결
import mongoose, { ConnectOptions } from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

function connect() {

    console.log("connecting");
    
    const mongoURI = process.env.MONGODB_URI;

    if (typeof mongoURI === "undefined") {
        throw new Error("Env const `mongoURI` is not defined");
    }

    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
      .then(() => {
        console.log('MongoDB connected successfully');
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
      });
}

export { connect };

    
//MySQL 연동
import mysql, { PoolOptions } from 'mysql2/promise';

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