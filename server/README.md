# MugiwaraFrostTV Video Streaming API

This is the Node.js backend server that proxies video content from Bunny.net through your domain, providing secure and scalable video streaming for MugiwaraFrostTV.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your Bunny.net credentials:

```env
BUNNY_STREAM_URL=https://vz-a01fffb9-e7a.b-cdn.net
BUNNY_API_KEY=your_actual_bunny_api_key
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:13500`

## 📁 Project Structure

```
server/
├── app.js                 # Main Express application
├── controllers/
│   └── videoController.js # Video streaming logic
├── routes/
│   └── videoRoutes.js     # API routes
├── middleware/
│   └── errorHandler.js    # Error handling
├── package.json
└── README.md
```

## 🎥 API Endpoints

### Video Streaming
- `GET /api/video/:id` - Stream video content (HLS playlist)
- `GET /api/video/:id/metadata` - Get video metadata
- `POST /api/video/:id/token` - Generate secure playback URL

### Health Check
- `GET /health` - Server health status

## 🔧 Features

- **HLS Streaming**: Supports adaptive bitrate streaming
- **Range Requests**: Enables video seeking and fast loading
- **CORS Support**: Configured for frontend integration
- **Rate Limiting**: Prevents abuse with request throttling
- **Security Headers**: Helmet.js for security
- **Error Handling**: Comprehensive error responses
- **Bunny.net Integration**: Proxy for CDN-hosted videos

## 🌐 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
- `NODE_ENV=production`
- `PORT=13500` (or your preferred port)
- `BUNNY_STREAM_URL=your_bunny_cdn_url`
- `BUNNY_API_KEY=your_bunny_api_key`

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Only allows requests from configured origins
- **Security Headers**: XSS, clickjacking, and content type protection
- **Input Validation**: UUID validation for video IDs
- **Error Sanitization**: No sensitive information in error responses

## 📊 Monitoring

The server includes health check endpoints and comprehensive logging for monitoring:

- Health status at `/health`
- Error logging for debugging
- Request/response logging (development only)

## 🎯 Integration with Frontend

The Next.js frontend connects to this API through Next.js rewrites:

```javascript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/video/:path*',
      destination: 'http://localhost:13500/api/video/:path*',
    },
  ];
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Video not loading**: Check Bunny.net credentials and video ID format
2. **CORS errors**: Verify CORS origin configuration
3. **Rate limiting**: Check if you've exceeded the rate limit
4. **Port conflicts**: Ensure port 13500 is available

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and logging.

## 📈 Performance

- **Streaming**: Direct passthrough from Bunny.net CDN
- **Caching**: 5-minute cache for playlists
- **Compression**: Automatic gzip compression
- **Connection Pooling**: Efficient HTTP connections

## 🔄 Updates

To update dependencies:

```bash
npm update
```

To check for security vulnerabilities:

```bash
npm audit
npm audit fix
```
