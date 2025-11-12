# 🎵 VMusic

> **"Feel the Indie Beat. Free. Forever."**

A modern, professional-grade music streaming web app for indie and royalty-free music. Built with React, Vite, and Tailwind CSS, powered by the Jamendo API.

## ✨ Features

- 🎧 **Stream Music:** Play full-length royalty-free songs from Jamendo
- 🔍 **Search & Discover:** Find songs, artists, and albums instantly
- 🎨 **Modern UI:** Clean, responsive design with dark/light mode
- 🚀 **Lightning Fast:** Built with Vite for optimal performance
- 📱 **Fully Responsive:** Perfect experience on mobile, tablet, and desktop
- 🆓 **100% Free:** No login required, completely ad-free

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4 with @tailwindcss/vite plugin
- **API:** Jamendo API (royalty-free music)
- **Animations:** Framer Motion (planned)
- **State:** React Context / Zustand (planned)
- **Routing:** React Router (planned)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd VMusic

# Install dependencies
npm install

# Install Tailwind CSS and plugins
npm install tailwindcss @tailwindcss/vite autoprefixer -D

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action.

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
VMusic/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route pages
│   ├── hooks/            # Custom React hooks
│   ├── api/              # API integration layer
│   ├── context/          # React Context providers
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/               # Static assets
└── ROADMAP.md           # Complete development roadmap
```

## 📚 Documentation

- **[Complete Development Roadmap](./ROADMAP.md)** — Detailed phase-by-phase plan with feature tracker, Gantt timeline, component breakdown, and implementation guides
- **[Tailwind Setup Guide](#)** — See ROADMAP.md for Tailwind configuration details

## 🎯 Roadmap Highlights

### Phase 1: Core Foundation (Week 1-2) ✅ In Progress
- ✅ Jamendo API integration
- ✅ Basic player functionality
- ⏳ Search & filters
- ⏳ Loading states & error handling

### Phase 2: Enhanced Playback (Week 3-4)
- Player controls (next/prev/shuffle/repeat)
- Seek bar & volume control
- Mini floating player
- Responsive design & animations

### Phase 3: Personalization (Week 5-6)
- Favorites & recently played
- Playlist creation
- Optional user authentication

### Phase 4: Discovery (Week 7-8)
- Trending & mood-based radio
- Artist profiles
- Social sharing

[See full roadmap →](./ROADMAP.md)

## 🎨 Features Roadmap

| Feature | Priority | Status |
|---------|----------|--------|
| Search & Filters | High | ⏳ Todo |
| Player Controls | High | ⏳ Todo |
| Dark/Light Mode | Medium | ⏳ Todo |
| Playlists | High | ⏳ Todo |
| PWA Support | Medium | ⏳ Todo |
| Lyrics | Low | ⏳ Todo |

## 🤝 Contributing

Contributions are welcome! Please read the [ROADMAP.md](./ROADMAP.md) for feature priorities and implementation guidelines.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

- Music provided by [Jamendo](https://www.jamendo.com/) — Royalty-free music platform
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Ready to build?** Check out the [complete roadmap](./ROADMAP.md) for step-by-step guidance! 🚀
