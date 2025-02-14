import { neon } from "@neondatabase/serverless";

// POST /api/user (create a new user) - creates a new user in the database with the given name, email, and clerkId
export async function POST(request: Request) {

  // Check if the request is authorized to access this endpoint
  try {

    // Check if the request is authorized to access this endpoint
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Parse the request body as JSON and extract the name, email, and clerkId
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
     );`;

    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
