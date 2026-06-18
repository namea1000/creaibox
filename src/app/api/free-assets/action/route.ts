import { NextRequest, NextResponse } from "next/server";
import { incrementAssetCounter } from "@/lib/google-drive";

export async function POST(req: NextRequest) {
  try {
    const { fileId, action } = await req.json();

    if (!fileId || !action) {
      return NextResponse.json(
        { error: "fileId and action are required." },
        { status: 400 }
      );
    }

    if (action !== "downloads" && action !== "views") {
      return NextResponse.json(
        { error: "Invalid action. Supported: downloads, views." },
        { status: 400 }
      );
    }

    const updatedMetadata = await incrementAssetCounter(fileId, action);

    return NextResponse.json({
      success: true,
      metadata: updatedMetadata,
    });
  } catch (error: any) {
    console.error("Failed to perform asset action:", error);
    return NextResponse.json(
      { error: "Action failed", details: error.message },
      { status: 500 }
    );
  }
}
