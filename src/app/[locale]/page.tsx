"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSelector />
        <ModeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("message")}</p>
      </div>
    </main>
  );
}
