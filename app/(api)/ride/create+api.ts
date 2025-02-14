import { neon } from "@neondatabase/serverless";

// Handle the POST request to insert data into the recent_rides table
export async function POST(request: Request) {

  // Try to parse the request body as JSON and extract the required fields
  try {
    // Parse the request body as JSON
    const body = await request.json();

    // Extract the required fields from the request body
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = body;

    // Check if any of the required fields are missing
    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      // Return an error response if any of the required fields are missing
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert the data into the recent_rides table 
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Insert the data into the recent_rides table
    const response = await sql`
      INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id
      ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${user_id}
      )
      RETURNING *;
    `;

    // Return the response to the client
    return Response.json({ data: response[0] }, { status: 201 });
  } catch (error) {
    // Return an error response if there was an error inserting the data
    console.error("Error inserting data into recent_rides:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
