import { CredentialForm } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";

export default async function Page() {
  await requireAuth();

  return (
    <div className="h-full p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <CredentialForm />
      </div>
    </div>
  );
}
