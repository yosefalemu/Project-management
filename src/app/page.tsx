import MainPageClient from "@/components/main-page-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    const host = headersList.get("host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const pathname = headersList.get("x-invoke-path") || "/";

    const fullUrl = `${protocol}://${host}${pathname}`;

    redirect(`/sign-in?redirectTo=${encodeURIComponent(fullUrl)}`);
  }

  const { lastWorkspaceId } = session.user || {};

  return (
    <div className="h-full flex items-center justify-center">
      <MainPageClient lastWorkspaceId={lastWorkspaceId} />
    </div>
  );
}
