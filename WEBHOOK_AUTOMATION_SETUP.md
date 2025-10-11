# 🎬 Bunny.net Webhook Automation Setup

## 🚀 **Complete Automation System**

Your MugiwaraFrostTV now has **fully automated anime management**! Upload videos directly to Bunny.net and watch your site update automatically with new anime and episodes.

## ✨ **How It Works**

1. **Upload video to Bunny.net** with title format: `"Anime Title - Episode X"`
2. **Bunny sends webhook** to your backend when video is ready
3. **Backend automatically creates** anime + episode in database
4. **Site updates instantly** - new anime becomes featured on homepage
5. **Hero section displays** latest anime with auto-play capability

## 🔧 **Setup Instructions**

### **STEP 1: Database Schema ✅**
Your Prisma schema is already updated with:
- `bunnyVideoId` unique constraint for webhook upserts
- Proper anime-episode relationships
- Featured anime management

### **STEP 2: Webhook Endpoint ✅**
Your webhook endpoint is ready at:
```
POST /api/bunny/webhook
```

**Handles these events:**
- ✅ `VideoUploaded` - When video is uploaded
- ✅ `VideoEncoded` - When video processing is complete
- ✅ `VideoReady` - When video is ready for streaming

### **STEP 3: Configure Bunny.net Webhook**

1. **Go to Bunny.net Dashboard**
   - Navigate to [Bunny.net Dashboard](https://dash.bunny.net/)
   - Go to **Stream** → **Webhooks**

2. **Add New Webhook**
   - Click **"Add Webhook"**
   - **Webhook URL**: `https://yourdomain.com/api/bunny/webhook`
   - **Events to Subscribe**:
     - ✅ **Video Uploaded**
     - ✅ **Video Encoded** (processing complete)
     - ✅ **Video Ready**

3. **Save Webhook**
   - Click **"Save"**
   - Bunny will now send webhooks to your endpoint

### **STEP 4: Test the Automation**

1. **Upload a video to Bunny.net** with this title format:
   ```
   My Status as an Assassin Obviously Exceeds the Hero's - Episode 1
   ```

2. **Watch the magic happen:**
   - Video uploads to Bunny.net
   - Bunny sends webhook to your backend
   - Backend creates anime + episode automatically
   - Your site homepage updates with new featured anime

## 🎯 **Title Format Rules**

### **For New Anime:**
```
"Anime Title - Episode 1"
```
- Creates new anime collection
- Makes it featured on homepage
- Adds first episode

### **For Existing Anime:**
```
"Existing Anime Title - Episode 2"
```
- Finds existing anime
- Adds new episode with sequential numbering
- Makes anime featured again (newest upload becomes featured)

### **Simple Format:**
```
"Anime Title"
```
- Creates anime with "Episode 1" as default episode title

## 🔍 **Webhook Processing Logic**

### **What Happens When Webhook is Received:**

1. **Parse Title**
   - Split on " - " to get anime title and episode title
   - Handle missing episode titles gracefully

2. **Find or Create Anime**
   - Search for existing anime by title (case-insensitive)
   - Create new anime if not found
   - Mark all other anime as not featured
   - Make new/updated anime featured

3. **Create or Update Episode**
   - Use `upsert` to handle duplicates
   - Generate sequential episode numbers
   - Create Bunny.net playback URLs
   - Generate thumbnail URLs

4. **Generate URLs**
   - **Playback**: `https://iframe.mediadelivery.net/play/{LIBRARY_ID}/{VIDEO_ID}`
   - **Thumbnail**: `https://{DELIVERY_DOMAIN}/{VIDEO_ID}/thumbnail.jpg`

## 📊 **Database Updates**

### **Anime Creation:**
```json
{
  "title": "Anime Title",
  "description": "Auto-created anime collection for Anime Title",
  "bannerImage": "https://cdn-url.com/video-id/thumbnail.jpg",
  "featured": true
}
```

### **Episode Creation:**
```json
{
  "title": "Episode 1",
  "bunnyVideoId": "video-guid-from-bunny",
  "playbackUrl": "https://iframe.mediadelivery.net/play/library-id/video-id",
  "thumbnail": "https://cdn-url.com/video-id/thumbnail.jpg",
  "episodeNumber": 1,
  "animeId": "anime-id"
}
```

## 🎨 **Frontend Integration**

### **Homepage Updates:**
- **Hero Section**: Automatically displays featured anime
- **Carousels**: Show real anime data from database
- **Latest Episodes**: Display newest uploads

### **Featured Anime Logic:**
- Newest upload automatically becomes featured
- Hero section fetches from `/api/featured`
- Real-time updates when new content is added

## 🚨 **Troubleshooting**

### **Webhook Not Working?**
1. **Check Bunny.net webhook logs**
2. **Verify webhook URL is correct**
3. **Check server logs for webhook errors**
4. **Test webhook endpoint**: `GET /api/bunny/webhook`

### **Anime Not Appearing?**
1. **Check database for new records**
2. **Verify title format matches expectations**
3. **Check webhook processing logs**
4. **Refresh homepage to see updates**

### **Episode Numbers Wrong?**
- Episode numbers are calculated based on existing episodes
- Webhook uses `upsert` to handle duplicate uploads
- Check database for correct episode counts

## 🎉 **Production Deployment**

### **Environment Variables:**
```bash
BUNNY_LIBRARY_ID=506159
BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
DATABASE_URL="file:./dev.db"
```

### **Webhook URL for Production:**
```
https://yourdomain.com/api/bunny/webhook
```

### **Security Considerations:**
- Webhook endpoint includes validation
- Handles malformed requests gracefully
- Logs all webhook activity for debugging

## 🔥 **Advanced Features**

### **Automatic Thumbnails:**
- Bunny.net generates thumbnails automatically
- Used for anime banners and episode previews
- Fallback to placeholder if thumbnail unavailable

### **Sequential Episode Numbering:**
- Episodes numbered automatically (1, 2, 3, etc.)
- Handles gaps in numbering gracefully
- Unique constraints prevent duplicates

### **Featured Anime Management:**
- Only one anime can be featured at a time
- Newest upload automatically becomes featured
- Homepage hero section updates instantly

## 🎬 **Testing Your Setup**

### **Test Upload Title:**
```
My Status as an Assassin Obviously Exceeds the Hero's - Episode 1
```

### **Expected Results:**
1. ✅ Anime "My Status as an Assassin Obviously Exceeds the Hero's" created
2. ✅ Episode 1 added to anime
3. ✅ Anime becomes featured on homepage
4. ✅ Hero section displays new anime with play button
5. ✅ Browse page shows new anime in carousels

## 🎨 **Your Automated Anime Streaming Platform is Ready!**

**🎉 Upload videos to Bunny.net → Watch your site update automatically!**

No more manual database management - your anime streaming platform now runs itself! 🍥

---

**Built with automation in mind for seamless anime streaming! 🚀**
