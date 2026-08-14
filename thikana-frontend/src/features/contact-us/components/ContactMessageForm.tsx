"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import {
  contactRoleOptions,
  MESSAGE_MAX_LENGTH,
} from "@/features/contact-us/data/contact-us.mock";
import {
  formDraftKeys,
  usePersistedState,
} from "@/hooks/use-persisted-state";
import { sendContactMessage } from "@/lib/api/support";

const fieldClassName =
  "h-11 w-full rounded-[10px] border border-brand-dark/50 bg-white px-3 font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark/50 focus-visible:ring-2 focus-visible:ring-brand-dark";

type ContactDraft = {
  fullName: string;
  email: string;
  role: string;
  subject: string;
  message: string;
  fileName: string | null;
  attachmentUrl: string | null;
};

const emptyContactDraft = (): ContactDraft => ({
  fullName: "",
  email: "",
  role: "",
  subject: "",
  message: "",
  fileName: null,
  attachmentUrl: null,
});

function mergeContactDraft(stored: unknown, fallback: ContactDraft): ContactDraft {
  if (!stored || typeof stored !== "object") return fallback;
  const raw = stored as Partial<ContactDraft>;
  return {
    fullName: typeof raw.fullName === "string" ? raw.fullName : fallback.fullName,
    email: typeof raw.email === "string" ? raw.email : fallback.email,
    role: typeof raw.role === "string" ? raw.role : fallback.role,
    subject: typeof raw.subject === "string" ? raw.subject : fallback.subject,
    message: typeof raw.message === "string" ? raw.message : fallback.message,
    fileName: typeof raw.fileName === "string" ? raw.fileName : null,
    attachmentUrl: typeof raw.attachmentUrl === "string" ? raw.attachmentUrl : null,
  };
}

export function ContactMessageForm() {
  const formId = useId();
  const [draft, setDraft, { clear }] = usePersistedState(
    formDraftKeys.contactMessage,
    emptyContactDraft,
    { merge: mergeContactDraft }
  );
  const { fullName, email, role, subject, message, fileName, attachmentUrl } = draft;

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);

    if (!fullName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setToast({
        type: "error",
        message: "Please fill in all required fields (Name, Email, Subject, Message).",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await sendContactMessage({
        fullName: fullName.trim(),
        email: email.trim(),
        role: role || "Just browsing",
        subject: subject.trim(),
        message: message.trim(),
        fileName: fileName || null,
        attachmentUrl: attachmentUrl || null,
      });

      clear();
      setToast({
        type: "success",
        message:
          response.message ||
          "Message sent successfully! Our support team will get back to you soon.",
      });

      // Auto-hide toast after 6 seconds
      setTimeout(() => {
        setToast((current) =>
          current?.type === "success" ? null : current
        );
      }, 6000);
    } catch (caught) {
      setToast({
        type: "error",
        message:
          caught instanceof Error
            ? caught.message
            : "Could not send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-8 rounded-[20px] border border-brand-dark/50 bg-white p-6 sm:p-8 lg:p-10"
        noValidate
      >
        <h2 className="font-inter text-2xl font-bold text-brand-dark sm:text-[28px]">
          Send Us a Message
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-name`} className="font-inter text-[13px] font-medium text-brand-dark">
              Full Name *
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={fullName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, fullName: event.target.value }))
              }
              placeholder="Enter your full name"
              className={fieldClassName}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-email`} className="font-inter text-[13px] font-medium text-brand-dark">
              Email Address *
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              value={email}
              onChange={(event) =>
                setDraft((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Enter your email"
              className={fieldClassName}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-role`} className="font-inter text-[13px] font-medium text-brand-dark">
              I am a...
            </label>
            <div className="relative">
              <select
                id={`${formId}-role`}
                value={role}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, role: event.target.value }))
                }
                className={`${fieldClassName} appearance-none pr-10 ${
                  role ? "text-brand-dark" : "text-brand-dark/50"
                }`}
                disabled={loading}
              >
                <option value="" disabled>
                  Select one — Tenant / Owner / Provider / Just browsing
                </option>
                {contactRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Image
                src="/images/contact-us/icon-chevron-down.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-subject`} className="font-inter text-[13px] font-medium text-brand-dark">
              Subject *
            </label>
            <input
              id={`${formId}-subject`}
              type="text"
              value={subject}
              onChange={(event) =>
                setDraft((current) => ({ ...current, subject: event.target.value }))
              }
              placeholder="What is your message about?"
              className={fieldClassName}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-message`} className="font-inter text-[13px] font-medium text-brand-dark">
              Message *
            </label>
            <div className="flex min-h-[140px] flex-col rounded-[10px] border border-brand-dark/50 bg-white p-3">
              <textarea
                id={`${formId}-message`}
                value={message}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    message: event.target.value.slice(0, MESSAGE_MAX_LENGTH),
                  }))
                }
                placeholder="Describe your issue or question..."
                rows={5}
                maxLength={MESSAGE_MAX_LENGTH}
                className="min-h-[96px] w-full flex-1 resize-none bg-transparent font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark/50"
                disabled={loading}
              />
              <p className="mt-2 text-right font-inter text-[11px] text-brand-dark/50">
                {message.length} / {MESSAGE_MAX_LENGTH}
              </p>
            </div>
          </div>

          <label
            htmlFor={`${formId}-file`}
            className="flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-brand-dark/50 px-4 py-3 text-center transition-colors hover:bg-surface"
          >
            <Image
              src="/images/contact-us/icon-cloud-upload.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="size-5"
            />
            <span className="font-inter text-[13px] text-brand-dark">
              {fileName ?? "Attach a screenshot if helpful"}
            </span>
            <span className="font-inter text-[11px] text-brand-dark/50">PNG, JPG up to 5MB</span>
            <input
              id={`${formId}-file`}
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              disabled={loading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  setToast({
                    type: "error",
                    message: "Image attachment must be smaller than 5MB.",
                  });
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  setDraft((current) => ({
                    ...current,
                    fileName: file.name,
                    attachmentUrl: reader.result as string,
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>

        <div className="flex flex-col gap-5">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-dark font-inter text-[15px] font-semibold text-white transition-all hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message →"}
          </button>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-inter text-sm font-medium text-[#16a34a] transition-opacity hover:opacity-80"
          >
            <span className="inline-flex size-5 items-center justify-center rounded-[10px] bg-[#16a34a]">
              <Image
                src="/images/contact-us/icon-whatsapp.svg"
                alt=""
                width={12}
                height={12}
                aria-hidden="true"
                className="size-3"
              />
            </span>
            Or chat with us on WhatsApp →
          </a>
        </div>
      </form>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 max-w-md ${
            toast.type === "success"
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
              : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
          }`}
        >
          {toast.type === "success" ? (
            <svg
              className="size-6 shrink-0 text-[#16a34a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="size-6 shrink-0 text-[#dc2626]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <div className="font-inter text-sm font-medium leading-tight">
            {toast.message}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-auto font-inter text-xs font-bold underline opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

