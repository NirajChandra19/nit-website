import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.query("SELECT NOW() as time");

    await connection.end();

    return Response.json(rows);
  } catch (err: any) {
    return Response.json({
      success: false,
      error: err.message,
      code: err.code,
    });
  }
}