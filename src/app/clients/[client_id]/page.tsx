import CreativeMediaBlogPage from "../creative-media-blog/page";
import SotongcheumPage from "../sotongcheum/page";

interface ClientPageProps {
  params: Promise<{
    client_id: string;
  }>;
}

export default async function GenericClientSiteFallbackPage({
  params,
}: ClientPageProps) {
  const resolvedParams = await params;
  const clientId = resolvedParams.client_id?.toLowerCase() || "";

  if (clientId === "creative-media-blog") {
    return <CreativeMediaBlogPage />;
  }

  // Default fallback to Sotongcheum template for any un-built templates
  return <SotongcheumPage />;
}
