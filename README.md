# Status Page Application

A modern status page application built with Next.js, allowing organizations to manage and display the status of their services and incidents.

## Features

- 🔐 User Authentication with NextAuth.js
- 👥 Team Management
- 🏢 Multi-tenant Organizations
- 🔧 Service Management (CRUD operations)
- 🚨 Incident Management
- 📊 Real-time Status Updates
- 🌐 Public Status Page
- 📱 Responsive Design
- 🎨 Modern UI with ShadcnUI

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **UI Components:** ShadcnUI
- **Styling:** Tailwind CSS
- **Real-time:** Socket.io
- **API:** tRPC

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/status_page?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/status-page.git
   cd status-page
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── (public)/          # Public routes
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── utils/                 # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.