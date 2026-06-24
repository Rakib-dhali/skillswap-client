import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const user = userSession?.user;
    const formData = await req.formData();
    const price = formData.get("price");
    const title = formData.get("title");
    const taskId = formData.get("taskId");
    
    const baseDomain = origin && origin !== "null" ? origin : `http://${headersList.get("host") || "localhost:3000"}`;

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(price) * 100,
            product_data: {
              name: title,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        price: Number(price),
        userId: user.id,
        userEmail: user.email,
        title,
        taskId,
      },
      mode: "payment",
      success_url: `${baseDomain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseDomain}/cancel`,
    });
    
    // Return JSON instead of redirect so fetch doesn't follow it automatically
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
