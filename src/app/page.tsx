import MainPageClient from "@/components/main-page-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { lastWorkspaceId } = session.user || {};

  return (
    <div className="h-full flex items-center justify-center">
      <MainPageClient lastWorkspaceId={lastWorkspaceId} />
    </div>
  );
}
