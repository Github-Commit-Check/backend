import { pool } from "../utils/db";

function test() {
    
    const str: string = "connectRepository";

    return str;
}

async function dbTest() {
    const [rows, fields] = await pool.query("SELECT 1");
    return rows;
}

export { test, dbTest };