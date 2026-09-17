import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/seo";

// Keep previously shared image URLs working with the current WebForm artwork.
export function GET() {
  return NextResponse.redirect(new URL("/og-image.png?v=webform-20260917", siteConfig.url), 308);
}
