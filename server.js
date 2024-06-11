import express from "express";
import bodyParser from'body-parser';
import cors from 'cors';

const app = express();

const port = 3000;

app.use(cors());
app.use(bodyParser.json());


import { pool } from "./db.js";

app.get("/", async (req, res) => {
    
    const [rows, fields] = await pool.query("SELECT 1");

    console.log(rows, fields);

  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});