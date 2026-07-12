import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";
import {
  contactFaqs,
  contactSocialLinks,
  contactSupportHours,
} from "@/features/contact-us/data/contact-us.mock";

export function ContactSidebar() {
  return (
    <aside className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-5 rounded-xl border border-brand-dark/20 bg-white p-6">
        <h2 className="font-inter text-xl font-bold text-brand-dark">
          Frequently Asked Questions
        </h2>
        <ul>
          {contactFaqs.map((faq) => (
            <li
              key={faq.id}
              className="flex items-center justify-between gap-3 border-b border-brand-dark/20 py-4"
            >
              <button
                type="button"
                className="flex flex-1 items-center justify-between gap-3 text-left font-inter text-sm font-medium text-brand-dark transition-opacity hover:opacity-70"
              >
                <span>{faq.question}</span>
                <Image
                  src="/images/contact-us/icon-chevron-right.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />
              </button>
            </li>
          ))}
        </ul>
        <Link
          href={routes.faq}
          className="self-start font-inter text-[13px] font-semibold text-brand-dark underline underline-offset-2 transition-opacity hover:opacity-70"
        >
          See All FAQs →
        </Link>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-brand-dark/20 bg-white p-6">
        <h2 className="font-inter text-xl font-bold text-brand-dark">Follow Us</h2>
        <ul className="flex items-start justify-center gap-8">
          {contactSocialLinks.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                aria-label={`${social.label} ${social.handle}`}
                className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-[20px] bg-brand-dark">
                  <Image
                    src={social.iconSrc}
                    alt=""
                    width={18}
                    height={18}
                    aria-hidden="true"
                    className="size-[18px]"
                  />
                </span>
                <span className="font-inter text-xs text-brand-dark">{social.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-brand-dark/20 bg-white p-6">
        <h2 className="font-inter text-xl font-bold text-brand-dark">Support Hours</h2>
        <ul className="w-full font-inter text-sm">
          {contactSupportHours.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 border-b border-brand-dark/20 py-3"
            >
              <span className="text-brand-dark">{row.day}</span>
              <span
                className={
                  row.closed
                    ? "font-semibold text-[#ef4444]"
                    : "text-brand-dark"
                }
              >
                {row.hours}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
