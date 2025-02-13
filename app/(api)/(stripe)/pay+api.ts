import { Stripe } from "stripe";

// Create a new instance of the Stripe class with your secret key from the environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Handle the POST request to the endpoint to confirm the payment intent
export async function POST(request: Request) {

  // Try to parse the request body as JSON and extract the required fields
  try {
    // Parse the request body as JSON and extract the required fields from it
    const body = await request.json();

    // Extract the required fields from the request body
    const { payment_method_id, payment_intent_id, customer_id, client_secret } =
      body;

    if (!payment_method_id || !payment_intent_id || !customer_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      { customer: customer_id },
    );

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment successful",
        result: result,
      }),
    );
  } catch (error) {
    console.error("Error paying:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
