import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log('Bunny Stream webhook received:', payload);
    
    // Bunny Stream webhook payload structure:
    // {
    //   "VideoLibraryId": 506159,
    //   "VideoGuid": "video-guid-here",
    //   "Status": "Ready", // or "Failed", "Deleted"
    //   "Title": "Episode Title",
    //   "DateCreated": "2024-01-01T00:00:00Z"
    // }
    
    const { VideoLibraryId, VideoGuid, Status, Title } = payload;
    
    if (VideoLibraryId !== 506159) {
      console.log('Webhook not for our library, ignoring');
      return NextResponse.json({ ok: true });
    }
    
    if (Status === 'Ready') {
      console.log(`New video ready: ${Title} (${VideoGuid})`);
      
      // Here you could:
      // 1. Send a notification to admins
      // 2. Update a database
      // 3. Trigger a rebuild of static pages
      // 4. Send real-time updates to connected clients
      
      // For now, just log the successful upload
      console.log(`✅ Video "${Title}" is ready for streaming!`);
      
    } else if (Status === 'Failed') {
      console.error(`❌ Video processing failed: ${Title} (${VideoGuid})`);
      
    } else if (Status === 'Deleted') {
      console.log(`🗑️ Video deleted: ${Title} (${VideoGuid})`);
    }
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Webhook processed successfully' 
    });
    
  } catch (error) {
    console.error('Error processing Bunny webhook:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: 'Bunny Stream webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
