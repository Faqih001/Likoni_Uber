import { neon } from "@neondatabase/serverless";

// GET /api/driver (get all drivers) - returns all drivers in the database
export async function GET(request: Request) {

  // Check if the request is authorized to access this endpoint
  try {
    // Check if the request is authorized to access this endpoint
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
