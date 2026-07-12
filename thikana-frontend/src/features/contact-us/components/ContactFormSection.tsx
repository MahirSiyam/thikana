import { Container } from "@/components/shared/Container";
import { ContactMessageForm } from "@/features/contact-us/components/ContactMessageForm";
import { ContactSidebar } from "@/features/contact-us/components/ContactSidebar";

export function ContactFormSection() {
  return (
    <section className="bg-surface pb-10 sm:pb-12 lg:pb-16" aria-label="Contact form and support">
      <Container>
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:grid-cols-[715fr_505fr]">
          <ContactMessageForm />
          <ContactSidebar />
        </div>
      </Container>
    </section>
  );
}
