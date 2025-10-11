import { NextRequest, NextResponse } from "next/server";

const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY!;
const DELIVERY_DOMAIN = process.env.BUNNY_DELIVERY_DOMAIN!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" }, 
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    console.log(`Uploading cover image: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);

    // Step 1: Create video entry in Bunny (we'll use the video library for images too)
    const createVideoResponse = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "AccessKey": BUNNY_API_KEY,
        },
        body: JSON.stringify({ 
          title: title || `Cover Image - ${file.name}`,
        }),
      }
    );

    if (!createVideoResponse.ok) {
      const errorText = await createVideoResponse.text();
      console.error("Failed to create Bunny video entry:", errorText);
      return NextResponse.json(
        { success: false, message: "Failed to create image entry in Bunny" }, 
        { status: 500 }
      );
    }

    const createData = await createVideoResponse.json();
    const videoId = createData.guid;

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: "No image ID returned from Bunny" }, 
        { status: 500 }
      );
    }

    console.log(`Created Bunny image entry with ID: ${videoId}`);

    // Step 2: Upload image file to Bunny
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
          "AccessKey": BUNNY_API_KEY,
        },
        body: fileBuffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Failed to upload image file to Bunny:", errorText);
      return NextResponse.json(
        { success: false, message: "Failed to upload image file to Bunny" }, 
        { status: 500 }
      );
    }

    console.log(`Image uploaded successfully to Bunny`);

    // Step 3: Return the image URL
    const imageUrl = `https://${DELIVERY_DOMAIN}/${videoId}`;

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      url: imageUrl,
      videoId: videoId,
    });

  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Image upload failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Image upload endpoint is active",
    supportedFormats: ["jpg", "jpeg", "png", "webp"],
    maxFileSize: "10MB"
  });
}
