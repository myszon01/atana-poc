import mysql from "mysql2/promise";
import {z} from "zod";

// TODO make it secure & use write or read replicas
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "rootpassword",
    database: process.env.MYSQL_DATABASE || "scormdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const update = async (query: string, params: any[]): Promise<any> => {
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (err) {
        console.error("Error during database query or validation:", err);
        throw err;
    }
}

export const queryWithValidation = async <T> (
    query: string,
    params: any[],
    schema: z.ZodSchema<T>
): Promise<T[]> => {
    try {
        const [rows] = await pool.execute(query, params);

        const result: T[] = schema.array().parse(rows);

        return result;
    } catch (err) {
        console.error("Error during database query or validation:", err);
        throw err;
    }
}


