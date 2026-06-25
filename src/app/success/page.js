import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    customer_details: { email: customerEmail },
    metadata,
    payment_intent,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment: {
            client_email: customerEmail,
            freelancer_email: metadata.freelancerEmail,
            task_id: metadata.actualTaskId,
            amount: Number(metadata.price),
            transaction_id: payment_intent.id,
            payment_status: status,
            paid_at: new Date().toISOString(),
          }
        }),
      });
    } catch (err) {
      console.error("Failed to record payment:", err);
    }

    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
          <br />
          <a href="/dashboard">Go to Dashboard</a>
        </p>
      </section>
    );
  }
}
