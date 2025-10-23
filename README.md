# LearnBite - AI-Powered Micro-Learning PWA

LearnBite is an AI-powered micro-learning Progressive Web App that revolutionizes education by delivering bite-sized, personalized learning experiences.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage)
- **AI:** OpenAI GPT-4o
- **Routing:** React Router

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your environment variables to `.env`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API and external service integrations
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Development Phases

This project follows the phase-wise development plan outlined in `app-requriements/app-development-docs.txt`.

**Phase 1 (Completed):**
- ✓ Project setup with React + TypeScript + Vite
- ✓ Tailwind CSS configuration with custom color palette
- ✓ Supabase client setup
- ✓ Folder structure
- ✓ ESLint and Prettier configuration
- ✓ Git repository initialization

**Phase 2 (Completed):**
- ✓ Reusable UI components (Button, Card, Input, SearchInput, ProgressBar, LoadingSpinner)
- ✓ Layout components (Header, PageContainer, MainLayout, BottomNav)
- ✓ Component library with TypeScript support

**Phase 3 & 4 (Completed):**
- ✓ Authentication pages (Login, Signup)
- ✓ Home page with streak counter and daily lesson CTA
- ✓ Topics page with search and category filters
- ✓ Progress page with stats and achievements
- ✓ Profile page with settings
- ✓ React Router setup with bottom navigation
- ✓ Full app navigation flow

**Current Status:** Working LearnBite PWA with complete UI! 🎉

## Color Palette

- **Primary (Indigo):** #6366F1
- **Secondary (Slate Gray):** #F8FAFC
- **Accent (Emerald):** #10B981

## Contributing

Please refer to the development plan in `app-requriements/app-development-docs.txt` for the complete feature roadmap.

## License

MIT
