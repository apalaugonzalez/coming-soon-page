"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t("form.errors.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("form.errors.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("form.errors.emailInvalid");
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = t("form.errors.messageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: t("form.success"),
        });
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || t("form.errors.submitFailed"),
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: t("form.errors.submitFailed"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-foreground">
          {t("form.title")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t("form.name")}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("form.namePlaceholder")}
              disabled={isSubmitting}
              className={`transition-all duration-200 ${
                errors.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-primary"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("form.email")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("form.emailPlaceholder")}
              disabled={isSubmitting}
              className={`transition-all duration-200 ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-primary"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              {t("form.message")}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("form.messagePlaceholder")}
              disabled={isSubmitting}
              rows={5}
              className={`transition-all duration-200 resize-none ${
                errors.message
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-primary"
              }`}
            />
            {errors.message && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.message}
              </p>
            )}
          </div>

          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg text-sm animate-fade-in ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 hover-lift transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse-slow">{t("form.submitting")}</span>
              </span>
            ) : (
              t("form.submit")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

