import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted min-h-svh flex flex-col justify-center items-center p-6 md:p-10">
      <div className="w-full flex flex-col max-w-sm gap-6">
        <Link href="/" className="flex items-center self-center font-medium gap-2">
          <Image src="logos/logo.svg" alt="n8n-zapier-copy" width={30} height={30} />
          n8n-zapier-copy
        </Link>
        {children}
      </div>
    </div>
  );
}
