import mysql from "mysql2/promise";
import {z} from "zod";

// TODO make it secure
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "password",
    database: process.env.MYSQL_DATABASE || "mydatabase",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function queryWithValidation<T>(
    query: string, // SQL Query
    params: any[], // Query parameters to bind
    schema: z.ZodSchema<T> // Zod schema to validate the query result
): Promise<T[]> {
    try {
        // Execute the query using the pool's promise API
        const [rows] = await pool.execute(query, params); // Returns a destructured result (rows as array)

        // Validate the rows against the Zod schema
        const result: T[] = schema.array().parse(rows);

        // Return the validated rows
        return result;
    } catch (err) {
        console.error("Error during database query or validation:", err);
        throw err;
    }
}


