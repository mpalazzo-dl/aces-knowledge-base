import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { gql } from "@apollo/client";

import { cfClient, cfPreviewClient } from "@aces/contentful";

const ResourceFileQuery = gql`
  query ($slug: String!, $preview: Boolean!) {
    resourceCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        file {
          url
          fileName
          contentType
          size
        }
      }
    }
  }
`;

// Vercel Functions cap response bodies at 4.5 MB; larger files are served
// straight from the Contentful CDN instead of being streamed through here.
const ProxyMaxBytes = 4 * 1024 * 1024;

interface ResourceFile {
  url: string;
  fileName: string;
  contentType: string;
  size: number;
}

const fetchResourceFile = async (
  slug: string,
  preview: boolean,
): Promise<ResourceFile | null> => {
  const client = preview ? cfPreviewClient : cfClient;
  try {
    const response = await client.query({
      query: ResourceFileQuery,
      variables: { slug, preview },
    });
    return response.data.resourceCollection.items[0]?.file || null;
  } catch (error) {
    console.error("Error fetching resource file:", error);
    return null;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const file = await fetchResourceFile(slug, isEnabled);

  if (!file?.url) {
    return new NextResponse("Resource not found", { status: 404 });
  }

  const fileUrl = file.url.startsWith("//") ? `https:${file.url}` : file.url;

  if (file.size > ProxyMaxBytes) {
    return NextResponse.redirect(fileUrl, 302);
  }

  const response = await fetch(fileUrl);

  if (!response.ok || !response.body) {
    return new NextResponse("Failed to fetch file", { status: 502 });
  }

  const fileName = file.fileName || slug;

  return new NextResponse(response.body, {
    status: 200,
    headers: {
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Length": file.size.toString(),
      "Content-Disposition": `attachment; filename="${fileName.replace(/"/g, "")}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": isEnabled ? "no-store" : "public, max-age=300",
    },
  });
}
