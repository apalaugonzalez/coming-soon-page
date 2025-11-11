# GitHub Copilot Instructions

## Architecture Overview

This is a **Next.js 14 App Router** project with **internationalization (i18n)** as a core architectural feature. The entire app is wrapped in a `[locale]` dynamic route segment (`src/app/[locale]/`), not using the root `src/app/` for pages or layouts.

### Critical Structure Rule

- **NO root layout/page**: The project has NO `src/app/layout.tsx` or `src/app/page.tsx`. All pages MUST be under `src/app/[locale]/`.
- Removing root files was essential to fix hydration errors - never recreate them.

### i18n Data Flow

1. **Middleware** (`src/middleware.ts`) detects locale from browser/URL → redirects to `/{locale}/path`
2. **i18n config** (`src/i18n.ts`) loads messages: awaits `requestLocale` (it's a Promise in next-intl v4+)
3. **Layout** (`src/app/[locale]/layout.tsx`) must:
   - Accept `params: Promise<{locale: string}>` (Next.js 14.2+ async params)
   - `await params` before destructuring
   - Call `setRequestLocale(locale)` for static rendering
   - Use `getMessages()` from `next-intl/server` (NOT `useMessages()` - async component)

## Key Patterns & Conventions

### Locale Configuration Triple-Lock

When adding/changing locales, update ALL three files synchronously:

```typescript
// src/middleware.ts
locales: ['en', 'de', 'es']

// src/i18n.ts
if (!locale || !['en', 'de', 'es'].includes(locale)) { ... }

// src/app/[locale]/layout.tsx
export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'de'}, {locale: 'es'}];
}

// src/components/language-selector.tsx
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  // ...
];
```

Missing one causes `./undefined.json` errors.

### Translation Usage

- **Client components**: `useTranslations()` from `next-intl`
- **Server components**: `await getTranslations()` from `next-intl/server`
- Translation files are flat JSON in `messages/{locale}.json` with top-level keys

### Theme System

- Uses `next-themes` with `class` attribute strategy (not data-theme)
- ThemeProvider wraps app in layout with `attribute="class"`, `defaultTheme="system"`, `enableSystem`
- Tailwind dark mode via `dark:` prefix

### Dropdown Menu Anti-Pattern

When creating multiple `DropdownMenu` components (Radix UI) on the same page:

```tsx
<DropdownMenu modal={false}> {/* Prevents interference */}
  <DropdownMenuItem onClick={(e) => {
    e.preventDefault(); // Stops event bubbling
    // action
  }}>
```

Without this, dropdowns trigger each other's actions (e.g., language selector changing theme).

### Styling Conventions

- Use `cn()` utility (`src/lib/utils.ts`) for conditional classes: `cn("base", condition && "conditional", className)`
- All components support dark mode with `dark:` variants
- shadcn/ui components in `src/components/ui/` - installed via CLI, not manually created

## Development Workflows

### Adding a New Page

```tsx
// src/app/[locale]/about/page.tsx
"use client";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("About");
  return <h1>{t("title")}</h1>;
}
```

Add translations to all `messages/*.json` files.

### Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add [component-name]
```

Components auto-install to `src/components/ui/` with proper TypeScript types.

### Navigation Between Locales

Use `router.replace()` not `router.push()` to avoid history pollution:

```tsx
const router = useRouter();
router.replace(`/${newLocale}${pathWithoutLocale}`);
```

## Common Pitfalls

### Error: `Cannot find module './undefined.json'`

**Cause**: Locale is undefined reaching i18n config.  
**Fix**: Ensure params are awaited in layout and locale triple-lock is synced (see above).

### Error: `useMessages is not callable within an async component`

**Cause**: Using client hook in server component.  
**Fix**: Use `await getMessages()` from `next-intl/server` instead.

### Hydration Error: `<html> cannot be a child of <body>`

**Cause**: Multiple layout files (root + locale).  
**Fix**: Delete `src/app/layout.tsx` - only keep `src/app/[locale]/layout.tsx`.

### Hydration Error: `Prop lang did not match`

**Cause**: Server renders different locale than client expects.  
**Fix**: Call `setRequestLocale(locale)` in layout before rendering.

## Testing Checklist

When modifying i18n or routing:

1. Test all locales: `/en`, `/de`, `/es`
2. Verify language selector switches without theme changes
3. Check browser console for hydration warnings
4. Confirm translations load (no "undefined.json" errors)

## Tech Stack Context

- **Next.js 14.2.3** with App Router (not Pages Router)
- **next-intl 4.5.1** (uses `requestLocale` Promise API, not `locale` string)
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **TypeScript** strict mode enabled
- **Path aliases**: `@/*` maps to `./src/*` (configured in `tsconfig.json`)

## Build & Development Commands

```bash
npm run dev    # Start dev server at http://localhost:3000
npm run build  # Production build with static generation
npm start      # Run production build locally
npm run lint   # ESLint check
```

**Note**: First request redirects to `/{locale}/` (e.g., `/en/`) based on browser settings.
