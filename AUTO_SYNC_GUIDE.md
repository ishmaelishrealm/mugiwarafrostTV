# 🔄 Bunny.net Auto-Sync System Guide

## 🎯 Overview

The Auto-Sync system allows you to upload videos directly to Bunny.net and automatically sync them to your MugiwaraFrostTV database. This is the **professional way** to manage your anime streaming platform.

## 🚀 How It Works

### 1. **Upload to Bunny.net**
- Upload anime episodes directly to your Bunny.net library (ID: 506159)
- Use Bunny.net's dashboard, API, or any upload tool
- No file size limits or browser upload issues

### 2. **Auto-Detection**
- Your `/api/sync-bunny` endpoint fetches all videos from Bunny.net
- Compares with your local database
- Automatically creates missing anime and episodes

### 3. **Smart Processing**
- **Anime Creation**: New anime series are auto-created from video titles
- **Episode Detection**: Episodes are automatically numbered and linked
- **Featured Anime**: Newest anime becomes featured on homepage
- **Duplicate Prevention**: Won't create duplicate entries

## 🎮 Usage Methods

### Method 1: Admin Dashboard Button
1. Go to `/admin` dashboard
2. Click **"Sync from Bunny"** button
3. Watch the magic happen! ✨

### Method 2: Direct API Call
```bash
# Manual sync via API
curl -X GET https://your-site.com/api/sync-bunny
```

### Method 3: Automated Cron Job (Optional)
Set up a cron job to sync every few hours:
```bash
# Sync every 6 hours
0 */6 * * * curl -X GET https://your-site.com/api/sync-bunny
```

## 📝 Video Naming Convention

For best results, name your videos using this format:

### ✅ Recommended Format:
```
Anime Title - Episode X - Episode Name.mp4
```

### Examples:
- `One Piece - Episode 1000 - The New Era Begins.mp4`
- `Attack on Titan - Episode 1 - To You, in 2000 Years.mp4`
- `Demon Slayer - Episode 26 - A New Mission.mp4`

### How It's Parsed:
- **Anime Title**: Everything before the first " - "
- **Episode Title**: Everything after the first " - "
- **Episode Number**: Extracted from "Episode X" pattern

## 🔧 System Features

### Smart Anime Detection
- Automatically creates new anime collections
- Prevents duplicate anime entries
- Updates existing anime with new episodes

### Episode Management
- Auto-numbers episodes (Episode 1, Episode 2, etc.)
- Links episodes to correct anime
- Updates existing episodes if needed

### Featured Anime System
- Newest anime automatically becomes featured
- Featured anime appears on homepage hero section
- Previous featured anime is unfeatured

### Error Handling
- Skips unprocessed videos (status ≠ 4)
- Logs errors for debugging
- Continues processing even if individual videos fail

## 📊 Sync Response

The sync endpoint returns detailed information:

```json
{
  "success": true,
  "message": "Sync complete! Added 5 new episodes, 2 new anime, updated 1 episodes",
  "details": {
    "totalVideos": 25,
    "newEpisodes": 5,
    "newAnime": 2,
    "updatedEpisodes": 1,
    "errors": []
  }
}
```

## 🎨 Admin Dashboard Integration

The admin dashboard now includes:
- **Sync Button**: One-click sync from Bunny.net
- **Status Messages**: Real-time feedback on sync progress
- **Success/Error Display**: Clear indication of sync results
- **Auto-Refresh**: Dashboard updates after successful sync

## 🔒 Security & Performance

### API Security
- Uses environment variables for Bunny.net credentials
- Validates video status before processing
- Handles errors gracefully

### Performance
- Efficient database queries with Prisma
- Batch processing of videos
- Minimal memory usage
- Fast response times

## 🛠️ Technical Details

### Environment Variables Required:
```env
BUNNY_API_KEY=your-bunny-api-key
BUNNY_LIBRARY_ID=506159
BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
```

### Database Schema:
- **Anime**: `title`, `description`, `bannerImage`, `featured`
- **Episode**: `title`, `episodeNumber`, `bunnyVideoId`, `playbackUrl`, `thumbnail`

### API Endpoints:
- `GET /api/sync-bunny` - Trigger sync
- `POST /api/sync-bunny` - Manual sync with options

## 🎯 Best Practices

### 1. **Consistent Naming**
- Use the recommended naming convention
- Include episode numbers for proper ordering
- Keep anime titles consistent across episodes

### 2. **Upload Strategy**
- Upload videos directly to Bunny.net (not through your site)
- Use Bunny.net's optimized upload tools
- Process videos to completion before syncing

### 3. **Sync Frequency**
- Sync after uploading new episodes
- Use manual sync for immediate updates
- Set up automated sync for regular updates

### 4. **Monitoring**
- Check sync logs for errors
- Verify new content appears on your site
- Monitor featured anime updates

## 🚨 Troubleshooting

### Common Issues:

#### Videos Not Appearing
- Check if videos are fully processed in Bunny.net (status = 4)
- Verify video titles follow naming convention
- Check sync logs for error messages

#### Duplicate Entries
- System prevents duplicates automatically
- Check for typos in anime titles
- Use consistent naming across episodes

#### Sync Failures
- Verify Bunny.net API credentials
- Check network connectivity
- Review error logs for specific issues

## 🎉 Benefits

✅ **Professional Workflow**: Upload directly to CDN, not through your site
✅ **No Upload Limits**: Bunny.net handles large files efficiently  
✅ **Automatic Management**: Smart anime and episode creation
✅ **Real-time Updates**: Immediate sync and site updates
✅ **Error Prevention**: Duplicate detection and validation
✅ **Scalable**: Handles hundreds of videos efficiently

Your MugiwaraFrostTV now operates like a professional streaming platform! 🎬✨

