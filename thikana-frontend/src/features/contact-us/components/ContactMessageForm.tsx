"use client";

import Image from "next/image";
import { useId, type FormEvent } from "react";
import {
  contactRoleOptions,
  MESSAGE_MAX_LENGTH,
} from "@/features/contact-us/data/contact-us.mock";
import {
  formDraftKeys,
  usePersistedState,
} from "@/hooks/use-persisted-state";

const fieldClassName =
  "h-11 w-full rounded-[10px] border border-brand-dark/50 bg-white px-3 font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark/50 focus-visible:ring-2 focus-visible:ring-brand-dark";

type ContactDraft = {
  fullName: string;
  email: string;
  role: string;
  subject: string;
  message: string;
  fileName: string | null;
};

const emptyContactDraft = (): ContactDraft => ({
  fullName: "",
  email: "",
  role: "",
  subject: "",
  message: "",
  fileName: null,
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
  };
}

export function ContactMessageForm() {
  const formId = useId();
  const [draft, setDraft, { clear }] = usePersistedState(
    formDraftKeys.contactMessage,
    emptyContactDraft,
    { merge: mergeContactDraft }
  );
  const { fullName, email, role, subject, message, fileName } = draft;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clear();
  };

  return (
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
            Full Name
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
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-email`} className="font-inter text-[13px] font-medium text-brand-dark">
            Email Address
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
            Subject
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
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-message`} className="font-inter text-[13px] font-medium text-brand-dark">
            Message
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
            onChange={(event) => {
              const file = event.target.files?.[0];
              setDraft((current) => ({
                ...current,
                fileName: file ? file.name : null,
              }));
            }}
          />
        </label>
      </div>

      <div className="flex flex-col gap-5">
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-brand-dark font-inter text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Send Message →
        </button>
        <a
          href="#"
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
  );
}
