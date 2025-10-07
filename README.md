# Evertory - Personal Story Platform

Evertory is a beautiful platform that allows individuals, couples, and families to easily build personal websites that tell their life stories. Create timeless digital memory books with photos, videos, and rich storytelling.

## ✨ Features

- **Easy Story Creation**: Intuitive editor for creating chapters and organizing content
- **Beautiful Templates**: Choose from elegant, responsive templates (Timeline, Gallery, Chapters, Masonry)
- **Media Upload**: Upload and organize photos and videos with automatic optimization
- **Custom Domains**: Each story gets a unique, memorable domain like `our-story.photolooks.app`
- **Rich Text Editor**: Write beautiful narratives with formatting, links, and embedded media
- **Privacy Controls**: Public or private stories with sharing options
- **Mobile Responsive**: Beautiful on all devices
- **Cloud Storage**: Secure backup of all your precious memories

## 🚀 Use Cases

- **Family History**: Document your family's journey, traditions, and milestones
- **Wedding Albums**: Create stunning digital wedding albums to share with loved ones
- **Child's Growth**: Chronicle your child's milestones and precious moments
- **Memorial Tributes**: Honor a loved one's memory with a beautiful tribute site
- **Life Milestones**: Celebrate graduations, anniversaries, and special achievements

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Media**: Cloudinary (production), local storage (development)
- **Styling**: Tailwind CSS, Framer Motion
- **Rich Text**: React Quill

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/photolooks.git
   cd photolooks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed with demo data**
   ```bash
   npx tsx lib/seed.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🧪 Demo Account

Try the platform with the demo account:
- **Email**: demo@photolooks.com
- **Password**: demo123

## 📁 Project Structure

```
photolooks/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── site/              # Public story sites
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── editor/            # Story editor components
│   ├── media/             # Media upload components
│   ├── providers/         # Context providers
│   └── templates/         # Story templates
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── public/                # Static assets
```

## 🎨 Templates

### Timeline Template
Perfect for chronological stories, life events, and family history. Features a beautiful vertical timeline with dates, content, and media.

### Gallery Template
Photo-focused layout with masonry grid for visual storytelling. Includes lightbox functionality for viewing full-size images.

### Chapters Template
Organized sections for complex stories and memoirs. Great for longer narratives with multiple themes.

### Masonry Template
Dynamic grid layout that adapts to your content. Perfect for mixed media stories.

## 🔧 Configuration

### Database
- Development uses SQLite for simplicity
- Production should use PostgreSQL
- Run `npx prisma studio` to view/edit data

### Media Upload
- Development uses mock URLs
- Production integrates with Cloudinary
- Configure Cloudinary credentials in environment variables

### Authentication
- Uses NextAuth.js with credentials provider
- Supports email/password authentication
- Can be extended with OAuth providers

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app can be deployed to any Node.js hosting platform:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

PhotoLooks is built with love for preserving precious memories. If you find it useful:

- ⭐ Star the repository
- 🐛 Report bugs via GitHub issues
- 💡 Suggest features via GitHub discussions
- 🤝 Contribute code or documentation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Heroicons](https://heroicons.com/)
- Images from [Unsplash](https://unsplash.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

**Made with ❤️ for preserving precious memories**
