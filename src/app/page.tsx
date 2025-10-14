import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Page() {
  await requireAuth();
  const users = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-6">
      protected server page
      <div>
        {JSON.stringify(users, null, 2)}
      </div>
    </div>
  );
}
