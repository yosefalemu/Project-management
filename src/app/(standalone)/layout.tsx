import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const requestUrl =
    headersList.get("x-request-url") || "http://localhost:3000/";

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    const redirectUrl = `/sign-in?redirect=${encodeURIComponent(requestUrl)}`;
    redirect(redirectUrl);
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
