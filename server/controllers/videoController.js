import axios from 'axios';
import crypto from 'crypto';

// Bunny.net configuration
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID || '506159';
const BUNNY_DELIVERY_DOMAIN = process.env.BUNNY_DELIVERY_DOMAIN || 'vz-a01fffb9-e7a.b-cdn.net';

/**
 * Generate secure token for video access
 */
const generateVideoToken = (videoId, expiresIn = 3600) => {
  const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
  const data = `${videoId}:${timestamp}`;
  const token = crypto.createHmac('sha256', BUNNY_API_KEY || 'fallback-key').update(data).digest('hex');
  return `${token}:${timestamp}`;
};

/**
 * Get video stream from Bunny.net
 */
export const getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Video ID is required' 
      });
    }

    // Validate video ID format (Bunny video IDs are UUIDs)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Invalid video ID format' 
      });
    }

    console.log(`Fetching video metadata for ID: ${id}`);

    // Get video metadata from Bunny API
    let videoMetadata = null;
    if (BUNNY_API_KEY) {
      try {
        const response = await axios.get(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${id}`, {
          headers: {
            'AccessKey': BUNNY_API_KEY,
            'Accept': 'application/json'
          },
          timeout: 10000
        });

        videoMetadata = response.data;
        console.log('Video metadata fetched successfully:', videoMetadata.title);
      } catch (apiError) {
        console.warn('Failed to fetch video metadata from API:', apiError.message);
        // Continue without metadata if API fails
      }
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Range, Content-Length');

    // Generate secure token
    const token = generateVideoToken(id);

    // Return video information and streaming URLs
    const response = {
      id,
      title: videoMetadata?.title || 'My Status as an Assassin...',
      description: videoMetadata?.description || 'Premium anime streaming',
      thumbnail: `https://${BUNNY_DELIVERY_DOMAIN}/${id}/thumbnail.jpg`,
      preview: `https://${BUNNY_DELIVERY_DOMAIN}/${id}/preview.webp`,
      streamUrl: `https://iframe.mediadelivery.net/play/${BUNNY_LIBRARY_ID}/${id}`,
      hlsUrl: `https://${BUNNY_DELIVERY_DOMAIN}/${id}/playlist.m3u8`,
      directUrl: `https://${BUNNY_DELIVERY_DOMAIN}/${id}/play_720p.mp4`,
      secureUrl: `https://${BUNNY_DELIVERY_DOMAIN}/${id}/play?token=${token}`,
      available: true,
      quality: ['1080p', '720p', '480p'],
      duration: videoMetadata?.duration || 1440,
      token,
      expires: Math.floor(Date.now() / 1000) + 3600
    };

    console.log('Returning video data:', response.title);
    res.json(response);

  } catch (error) {
    console.error('Video streaming error:', error.message);
    
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to stream video',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get video metadata
 */
export const getVideoMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Video ID is required' 
      });
    }

    // This would typically fetch from your database
    // For now, return basic metadata
    res.json({
      id,
      title: 'Anime Episode',
      duration: 1440, // 24 minutes in seconds
      thumbnail: `${BUNNY_STREAM_URL}/${id}/thumbnail.jpg`,
      available: true,
      quality: ['1080p', '720p', '480p'],
      subtitles: ['English', 'Japanese']
    });

  } catch (error) {
    console.error('Video metadata error:', error.message);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch video metadata' 
    });
  }
};

/**
 * Generate secure playback URL
 */
export const generatePlaybackUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { expires = 3600 } = req.body; // Default 1 hour
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Video ID is required' 
      });
    }

    const token = generateVideoToken(id, expires);
    const playbackUrl = `${req.protocol}://${req.get('host')}/api/video/${id}?token=${token}`;
    
    res.json({
      playbackUrl,
      expires: Math.floor(Date.now() / 1000) + expires,
      token
    });

  } catch (error) {
    console.error('Playback URL generation error:', error.message);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to generate playback URL' 
    });
  }
};
