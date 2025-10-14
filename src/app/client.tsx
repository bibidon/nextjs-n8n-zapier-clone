"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function Client() {
  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions());

  return (
    <div>
      <h1>Users</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
