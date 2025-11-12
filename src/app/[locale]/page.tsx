"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { ContactForm } from "@/components/contact-form";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6 sm:p-12 lg:p-24">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 gradient-mesh -z-10" />
      
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern -z-10 opacity-30 dark:opacity-20" />

      {/* Header controls with fade-in */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 fade-in">
        <LanguageSelector />
        <ModeToggle />
      </div>

      {/* Main content with staggered animations */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Subtitle with fade-in */}
          <p className="text-sm sm:text-base font-medium text-muted-foreground uppercase tracking-wider fade-in-delay-1">
            {t("subtitle")}
          </p>

          {/* Main title with gradient text and fade-in */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight fade-in-delay-2">
            <span className="gradient-text">{t("title")}</span>
          </h1>

          {/* Message with fade-in */}
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed fade-in-delay-3">
            {t("message")}
          </p>

          {/* Teaser text with fade-in */}
          <p className="text-sm sm:text-base text-muted-foreground/80 italic fade-in-delay-3">
            {t("teaser")}
          </p>
        </div>

        {/* Contact form with fade-in */}
        <div className="mt-16 sm:mt-20 lg:mt-24 fade-in-delay-3">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
