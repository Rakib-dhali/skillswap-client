"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/signin");
      } else {
        const role = session.user.role || "client";
        router.push(`/dashboard/${role}`);
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-xs font-bold tracking-widest text-black/40 uppercase">
      Redirecting to Dashboard...
    </div>
  );
};

export default DashboardPage;
