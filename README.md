<<<<<<< HEAD
# MugiwaraFrostTV

A premium anime streaming platform built with Next.js, TypeScript, and modern web technologies. Watch your favorite anime legally, ad-free, and in the highest quality.

## 🚀 Features

- **High-Quality Streaming**: HLS adaptive streaming with multiple quality options
- **Premium Experience**: Ad-free viewing with premium content
- **Modern UI/UX**: Beautiful, responsive design with dark theme
- **User Management**: Authentication, profiles, and watchlists
- **Admin Panel**: Content management and upload system
- **Payment Integration**: Stripe integration for subscriptions
- **Mobile Responsive**: Optimized for all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Video Player**: HLS.js
- **Deployment**: Vercel (frontend) + Railway/Render (backend)
=======
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
>>>>>>> 48ca5580b8afa347b3e2d03df70e19e2fafe9f70

## 📁 Project Structure

```
<<<<<<< HEAD
mugiwarafrost-tv/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── browse/            # Browse anime
│   ├── show/              # Individual show pages
│   └── ...
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── player/           # Video player components
│   ├── cards/            # Card components
│   └── ui/               # UI components
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Cloudflare Stream account (for video hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mugiwarafrost-tv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/mugiwarafrost_tv"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # Cloudflare Stream
   CLOUDFLARE_ACCOUNT_ID="your-account-id"
   CLOUDFLARE_API_TOKEN="your-api-token"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 🎨 Design System

### Color Palette

- **Primary**: Mugiwara Orange (`#ff6b35`)
- **Secondary**: Deep Navy (`#0a0a0f`)
- **Background**: Pure Black (`#000000`)
- **Premium**: Gold (`#ffd700`)
- **Success**: Green (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Typography

- **Primary Font**: Inter (Google Fonts)
- **Monospace Font**: JetBrains Mono (Google Fonts)

## 🔧 Configuration

### Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts and authentication
- **Show**: Anime series and movies
- **Episode**: Individual episodes
- **Watchlist**: User's watchlist and ratings
- **Subscription**: Premium subscription management

### Video Streaming

- Uses HLS.js for adaptive streaming
- Supports multiple quality levels (480p, 720p, 1080p, 4K)
- Implements secure token-based access control
- Optimized for both desktop and mobile playback

### Authentication

- NextAuth.js with multiple providers
- JWT tokens for API authentication
- Role-based access control (User, Admin, Moderator)
- Secure password hashing with bcrypt

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy the application

### Database

Use a managed PostgreSQL service like:
- Railway PostgreSQL
- Supabase
- PlanetScale
- Neon

## 🔒 Security

- CSRF protection with NextAuth.js
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload handling
- HTTPS enforcement in production

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-optimized video controls
- Mobile-first navigation
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Anime industry for creating amazing content
- Open source community for excellent tools
- Contributors and supporters of the project

## 📞 Support

For support, email support@mugiwarafrost.tv or join our Discord community.

---

**Made with ❤️ for the anime community**
=======
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
>>>>>>> 48ca5580b8afa347b3e2d03df70e19e2fafe9f70
