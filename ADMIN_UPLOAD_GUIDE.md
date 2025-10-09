# 🎨 Admin Upload Dashboard Guide

## Overview
Your MugiwaraFrostTV project now has a powerful admin upload dashboard that allows you to easily upload anime episodes with intelligent anime selection and automatic database management.

## 🚀 Features

### ✅ **Smart Anime Selection**
- **Search existing anime**: Type to search through your existing anime collection
- **Create new anime**: Add episodes to new anime series
- **Visual feedback**: See episode counts and featured status
- **Auto-complete**: Dropdown with existing anime suggestions

### ✅ **Seamless Upload Process**
- **Direct Bunny.net integration**: Uploads directly to your CDN
- **Automatic database creation**: Creates anime and episode records
- **Episode numbering**: Automatically assigns episode numbers
- **Featured management**: Newest upload becomes featured anime

### ✅ **User-Friendly Interface**
- **Real-time status updates**: See upload progress and results
- **File validation**: Supports MP4, MKV, AVI, MOV, WebM
- **Auto-fill from filename**: Episode titles auto-populate from file names
- **Responsive design**: Works on all devices

## 📁 File Structure

```
app/
├── admin/upload/page.tsx          # Main upload interface
├── api/
│   ├── upload/route.ts            # Upload endpoint (existing)
│   └── anime/route.ts             # Anime fetching endpoint (new)
```

## 🎯 How to Use

### 1. **Access the Dashboard**
Navigate to `/admin/upload` in your browser

### 2. **Select or Create Anime**
- **Search existing**: Type in the search box to find existing anime
- **Create new**: Click "New" button or type a new anime name
- **Visual indicators**: See episode counts and featured status

### 3. **Add Episode Details**
- **Episode Title**: Enter descriptive episode title
- **Description**: Optional episode description
- **File**: Select video file (up to 2GB)

### 4. **Upload**
- Click "Upload Episode" button
- Watch real-time progress updates
- Get confirmation with episode details

## 🔧 Technical Details

### **API Endpoints**

#### `GET /api/anime`
Fetches all existing anime with episode counts
```json
{
  "anime": [
    {
      "id": "anime-id",
      "title": "Anime Title",
      "episodeCount": 5,
      "featured": true
    }
  ],
  "total": 1
}
```

#### `POST /api/upload`
Handles file upload to Bunny.net and database creation
- **Input**: FormData with file, title, description, collection
- **Output**: Success response with episode details

### **Database Integration**
- **Anime Model**: Creates/updates anime records
- **Episode Model**: Creates new episode with auto-numbering
- **Featured Management**: Automatically manages featured anime

### **Bunny.net Integration**
- **Video Creation**: Creates video entry in Bunny library
- **File Upload**: Direct upload to Bunny CDN
- **Playback URLs**: Generates iframe and thumbnail URLs

## 🎨 UI Components

### **Anime Selection**
- Search input with dropdown
- "New" button for creating new anime
- Episode count display
- Featured status indicator

### **Upload Form**
- File input with drag-and-drop styling
- Episode title and description fields
- Upload button with loading states
- Status messages with icons

### **Status Feedback**
- Loading spinner during upload
- Success confirmation with details
- Error messages with troubleshooting
- Real-time progress updates

## 🚀 Getting Started

1. **Set up environment variables** in `.env.local`:
   ```bash
   BUNNY_LIBRARY_ID=506159
   BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
   BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
   ```

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **Navigate to admin dashboard**:
   ```
   http://localhost:3000/admin/upload
   ```

4. **Upload your first episode**:
   - Select/create anime
   - Add episode details
   - Upload video file
   - Watch it appear on your site!

## 🎉 What Happens After Upload

1. **Video uploaded** to Bunny.net CDN
2. **Anime created/updated** in database
3. **Episode added** with automatic numbering
4. **Featured anime updated** (newest becomes featured)
5. **Homepage updated** with new content
6. **Playback ready** with iframe URLs

Your MugiwaraFrostTV site will automatically display the new content in the hero section and episode listings!

---

**🎨 Built with love for your anime streaming platform!**
