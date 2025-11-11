# The Coming Soon Page

A modern "Coming Soon" landing page built with Next.js, featuring internationalization support and dark mode.

## Features

- 🌍 **Internationalization (i18n)** - Support for English, German, and Spanish
- 🌓 **Dark Mode** - Toggle between light, dark, and system themes
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- ⚡ **Next.js 14** - App Router with Server Components
- 🔄 **Language Selector** - Easy switching between available languages
- 📱 **Responsive Design** - Looks great on all devices

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed on your machine

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/your_username/the-coming-soon-page.git
   ```

2. Navigate to the project directory

   ```sh
   cd the-coming-soon-page
   ```

3. Install dependencies
   ```sh
   npm install
   ```

### Running the Application

Start the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The app will automatically redirect to your browser's language (en, de, or es).

## Available Languages

- 🇬🇧 English (`/en`)
- 🇩🇪 Deutsch (`/de`)
- 🇪🇸 Español (`/es`)

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── layout.tsx     # Root layout with i18n
│   │   └── page.tsx       # Coming soon page
│   └── globals.css        # Global styles
├── components/
│   ├── language-selector.tsx  # Language switcher
│   ├── mode-toggle.tsx        # Theme toggle
│   ├── theme-provider.tsx     # Theme context
│   └── ui/                    # shadcn/ui components
├── lib/
│   └── utils.ts           # Utility functions
├── i18n.ts                # i18n configuration
└── middleware.ts          # Next.js middleware for routing
messages/
├── en.json                # English translations
├── de.json                # German translations
└── es.json                # Spanish translations
```

## Adding New Languages

1. Create a new JSON file in the `messages/` directory (e.g., `fr.json`)
2. Add translations matching the structure of existing files
3. Update `src/middleware.ts` to include the new locale in the `locales` array
4. Update `src/i18n.ts` to include the new locale in the validation array
5. Update `src/app/[locale]/layout.tsx` to add the locale to `generateStaticParams`
6. Update `src/components/language-selector.tsx` to add the new language option

## Build for Production

```sh
npm run build
npm start
```
