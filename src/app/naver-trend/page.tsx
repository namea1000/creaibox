import { redirect } from "next/navigation";

export default async function NaverTrendRootPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams?.tab ? `?tab=${resolvedParams.tab}` : "";
  redirect(`/studio/naver-trend${tab}`);
}
