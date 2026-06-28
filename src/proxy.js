import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role == "admin") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }
  if (session?.user?.role == "client") {
    return NextResponse.redirect(new URL("/dashboard/client", request.url));
  }
  if (session?.user?.role == "freelancer") {
    return NextResponse.redirect(new URL("/dashboard/freelancer", request.url));
  }

  if (!session) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }
}

export const config = {
  matcher: ["/dashboard",]
};
