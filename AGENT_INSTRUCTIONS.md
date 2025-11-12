# Agent Instructions for The Coming Soon Page

This document provides comprehensive guidelines for AI agents and developers working on this project.

## Project Overview

This is a modern "Coming Soon" landing page built with Next.js 14, featuring:
- **Internationalization (i18n)**: Support for English (en), German (de), and Spanish (es)
- **Dark Mode**: Light, dark, and system theme support
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **App Router**: Uses Next.js 14 App Router with Server Components
- **Contact Form**: Email contact form with SMTP support via nodemailer

## Tech Stack

### Core Dependencies
- **Next.js 14.2.3**: React framework with App Router
- **React 18**: UI library
- **TypeScript 5**: Type safety
- **next-intl 4.5.1**: Internationalization library
- **next-themes 0.3.0**: Theme management (dark/light mode)
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **shadcn/ui**: UI component library (Radix UI primitives)

### Key Libraries
- **@radix-ui/react-dropdown-menu**: Dropdown menu component
- **@radix-ui/react-slot**: Slot component for composition
- **@radix-ui/react-label**: Label component for forms
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **clsx** & **tailwind-merge**: Utility functions for className management
- **nodemailer**: Email sending via SMTP

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # Localized routes (dynamic segment)
│   │   ├── layout.tsx        # Root layout with i18n & theme providers
│   │   └── page.tsx          # Main coming soon page (Client Component)
│   ├── api/
│   │   └── contact/
│   │       └── route.ts     # Contact form API endpoint (POST handler)
│   └── globals.css           # Global styles with CSS variables
├── components/
│   ├── contact-form.tsx       # Contact form component
│   ├── language-selector.tsx  # Language switcher dropdown
│   ├── mode-toggle.tsx        # Theme toggle button
│   ├── theme-provider.tsx     # Theme context provider
│   └── ui/                    # shadcn/ui components
│       ├── button.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── textarea.tsx
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
├── i18n.ts                   # next-intl configuration
└── middleware.ts             # Next.js middleware for locale routing

messages/
├── en.json                   # English translations
├── de.json                   # German translations
└── es.json                   # Spanish translations
```

## Key Conventions & Patterns

### 1. Internationalization (i18n)

**How it works:**
- Routes are prefixed with locale: `/en`, `/de`, `/es`
- Middleware (`src/middleware.ts`) handles locale detection and routing
- Translations are stored in `messages/{locale}.json`
- Use `useTranslations()` hook in Client Components
- Use `getTranslations()` in Server Components

**Adding translations:**
1. Add key-value pairs to all locale files in `messages/`
2. Use `t("key")` in components to access translations
3. Keep translation keys consistent across all locale files

**Adding a new language:**
1. Create `messages/{locale}.json` with same structure as existing files
2. Update `src/middleware.ts`: Add locale to `locales` array
3. Update `src/i18n.ts`: Add locale to validation array `['en', 'de', 'es', 'new']`
4. Update `src/app/[locale]/layout.tsx`: Add to `generateStaticParams()`
5. Update `src/components/language-selector.tsx`: Add language option

**Example:**
```tsx
// Client Component
"use client";
import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations();
  return <h1>{t("title")}</h1>;
}
```

### 2. Theming (Dark Mode)

**How it works:**
- Uses `next-themes` for theme management
- ThemeProvider wraps the app in `layout.tsx`
- CSS variables in `globals.css` define theme colors
- Tailwind uses `dark:` prefix for dark mode styles
- Theme toggle component in top-right corner

**Theme modes:**
- `light`: Light theme
- `dark`: Dark theme
- `system`: Follows OS preference (default)

**Using theme colors:**
- Use semantic color tokens: `bg-background`, `text-foreground`, `text-muted-foreground`
- Colors are defined in `tailwind.config.ts` using CSS variables
- CSS variables are in `src/app/globals.css`

### 3. Component Patterns

**Server vs Client Components:**
- Default: Server Components (no "use client")
- Use "use client" only when needed (hooks, interactivity, browser APIs)
- `page.tsx` is a Client Component because it uses `useTranslations()` hook

**Component Structure:**
- UI components in `src/components/ui/` follow shadcn/ui patterns
- Custom components in `src/components/`
- Use TypeScript for all components
- Export components as default or named exports consistently

**Styling:**
- Use Tailwind CSS utility classes
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow shadcn/ui design patterns
- Use semantic color tokens (background, foreground, muted, etc.)

### 4. File Naming & Organization

- **Components**: kebab-case (`language-selector.tsx`)
- **Pages**: Next.js conventions (`page.tsx`, `layout.tsx`)
- **Utilities**: kebab-case (`utils.ts`)
- **Config files**: kebab-case or standard names (`i18n.ts`, `middleware.ts`)

### 5. TypeScript

- Strict TypeScript configuration
- Use proper types for all props and functions
- Leverage Next.js types (`Metadata`, route params, etc.)
- Use `satisfies` for config objects when appropriate

### 6. Contact Form

**How it works:**
- Contact form component at `src/components/contact-form.tsx`
- API route at `src/app/api/contact/route.ts` handles form submissions
- Uses nodemailer to send emails via SMTP
- Form fields: name, email, message
- Client-side and server-side validation
- Supports all three languages (en, de, es)
- Works in both light and dark themes

**Environment Variables:**
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (587 for TLS, 465 for SSL)
- `SMTP_USER`: SMTP username (usually email address)
- `SMTP_PASSWORD`: SMTP password
- `SMTP_FROM_EMAIL`: Email address to send from
- `CONTACT_RECIPIENT_EMAIL`: Email address to receive submissions (defaults to info@immersegeek.com)

**API Route:**
- Located at `/api/contact`
- Accepts POST requests with JSON body: `{ name, email, message }`
- Validates input on server side
- Returns 200 on success, 400/500 on error
- Excluded from i18n middleware (already configured)

**Form Component:**
- Client Component (uses hooks for state management)
- Real-time validation feedback
- Loading states during submission
- Success/error message display
- Form resets on successful submission

## Development Guidelines

### When Adding Features

1. **Check i18n first**: If adding text, add translations to all locale files
2. **Consider theming**: Ensure components work in both light and dark modes
3. **Use semantic colors**: Prefer theme tokens over hardcoded colors
4. **Follow component patterns**: Match existing component structure
5. **Test responsiveness**: Ensure mobile-friendly design

### When Modifying Components

1. **Preserve i18n**: Don't hardcode text, use translation keys
2. **Maintain theme support**: Test in both light and dark modes
3. **Keep accessibility**: Use proper ARIA labels and semantic HTML
4. **Follow shadcn/ui patterns**: If using shadcn components, follow their conventions

### When Adding New Dependencies

1. **Check compatibility**: Ensure compatibility with Next.js 14 and React 18
2. **Update package.json**: Add to appropriate section (dependencies/devDependencies)
3. **Run npm install**: Install new packages
4. **Update documentation**: If needed, update relevant docs

## Common Tasks

### Adding a New Translation Key

1. Add the key to `messages/en.json`:
   ```json
   {
     "title": "Coming Soon",
     "newKey": "New translation"
   }
   ```
2. Add translations to `messages/de.json` and `messages/es.json`
3. Use in component: `t("newKey")`

### Adding a New UI Component

1. If using shadcn/ui: Run `npx shadcn-ui@latest add [component]`
2. If custom: Create in `src/components/` or `src/components/ui/`
3. Follow existing component patterns
4. Export appropriately

### Modifying Theme Colors

1. Edit CSS variables in `src/app/globals.css`
2. Colors are automatically available via Tailwind config
3. Test in both light and dark modes

### Running the Project

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## Important Files Reference

- **`src/middleware.ts`**: Locale routing and detection
- **`src/i18n.ts`**: next-intl configuration and locale validation
- **`src/app/[locale]/layout.tsx`**: Root layout with providers
- **`src/app/[locale]/page.tsx`**: Main page with contact form
- **`src/app/api/contact/route.ts`**: Contact form API endpoint
- **`src/components/contact-form.tsx`**: Contact form component
- **`src/app/globals.css`**: Global styles and CSS variables
- **`tailwind.config.ts`**: Tailwind configuration and theme tokens
- **`messages/*.json`**: Translation files
- **`.env.example`**: Environment variables template

## Best Practices

1. **Always use translations**: Never hardcode user-facing text
2. **Test all locales**: Ensure features work in all supported languages
3. **Test themes**: Verify components in light, dark, and system modes
4. **Mobile-first**: Design for mobile, enhance for desktop
5. **Accessibility**: Use semantic HTML and ARIA attributes
6. **Performance**: Leverage Server Components when possible
7. **Type safety**: Use TypeScript types consistently

## Troubleshooting

### Translations not working
- Check that key exists in all locale files
- Verify locale is in `middleware.ts` and `i18n.ts`
- Ensure component is wrapped in `NextIntlClientProvider`

### Theme not working
- Verify `ThemeProvider` wraps the app in layout
- Check CSS variables are defined in `globals.css`
- Ensure `darkMode: ["class"]` in `tailwind.config.ts`

### Build errors
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors with `npm run lint`
- Verify all locale files have matching keys

### Contact form not sending emails
- Verify all SMTP environment variables are set in `.env.local`
- Check SMTP credentials are correct
- Ensure SMTP server allows connections from your deployment environment
- Check server logs for nodemailer errors
- Verify `CONTACT_RECIPIENT_EMAIL` is set correctly

## Notes for AI Agents

- **Always check existing patterns** before creating new code
- **Maintain consistency** with existing code style
- **Update all locale files** when adding translations
- **Test theme compatibility** when adding UI elements
- **Use semantic HTML** and accessibility best practices
- **Follow Next.js 14 App Router** conventions
- **Preserve existing functionality** when making changes
- **Document significant changes** in code comments if needed
- **Validate form inputs** on both client and server side
- **Use environment variables** for sensitive configuration (SMTP credentials)
- **Handle errors gracefully** with user-friendly messages
- **Test API routes** independently from the frontend

