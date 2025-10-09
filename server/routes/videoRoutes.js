import express from 'express';
import { getVideo, getVideoMetadata, generatePlaybackUrl } from '../controllers/videoController.js';

const router = express.Router();

// GET /api/video/:id - Stream video content
router.get('/:id', getVideo);

// GET /api/video/:id/metadata - Get video metadata
router.get('/:id/metadata', getVideoMetadata);

// POST /api/video/:id/token - Generate secure playback URL
router.post('/:id/token', generatePlaybackUrl);

// OPTIONS handler for CORS preflight
router.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
  res.status(200).end();
});

export default router;
