import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <main className="px-6 py-8 text-slate-100">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
    </main>
  );
}
