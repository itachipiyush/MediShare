# MediShare

A platform for sharing and managing medicines within communities.

## Features

- User authentication and authorization
- Medicine listing and search
- Medicine details and management
- Favorites system
- Notifications
- Responsive design
- Dark mode support

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Zustand
- React Hook Form
- Zod
- Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/medishare.git
   cd medishare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Zustand stores
├── lib/          # Utility functions
├── types/        # TypeScript type definitions
└── App.tsx       # Main application component
```

## Testing

The project uses Jest and React Testing Library for testing. Run tests with:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com) for the backend
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React](https://reactjs.org) for the UI framework 