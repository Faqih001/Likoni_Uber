import { Stripe } from "stripe";

// Stripe API Key is required to be set in the environment variables of the Cloudflare Worker script
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// You can set it using the wrangler CLI or the Cloudflare dashboard under the "Workers" section
export async function POST(request: Request) {

  // Parse the request body to get the name, email, and amount
  const body = await request.json();
  const { name, email, amount } = body;

  // Check if the required fields are present in the request body
  if (!name || !email || !amount) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Check if the email is valid using a regex pattern
  let customer;
  const doesCustomerExist = await stripe.customers.list({
    email,
  });

  // If the customer already exists, use the existing customer object to create the payment intent
  if (doesCustomerExist.data.length > 0) {
    customer = doesCustomerExist.data[0];
  } else {
    const newCustomer = await stripe.customers.create({
      name,
      email,
    });

    // If the customer does not exist, create a new customer object
    customer = newCustomer;
  }

  // Create an ephemeral key for the customer to authenticate the payment
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-06-20" },
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: customer.id,
    }),
  );
}
