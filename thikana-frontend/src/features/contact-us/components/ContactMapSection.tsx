import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { contactMap } from "@/features/contact-us/data/contact-us.mock";

export function ContactMapSection() {
  return (
    <section className="bg-surface pb-10 sm:pb-12 lg:pb-16" aria-labelledby="contact-map-heading">
      <Container>
        <h2 id="contact-map-heading" className="sr-only">
          Office location map
        </h2>
        <div className="relative aspect-[1240/456] w-full overflow-hidden rounded-[20px] bg-[#d9d9d9]">
          <Image
            src={contactMap.imageSrc}
            alt={contactMap.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1240px"
          />
        </div>
      </Container>
    </section>
  );
}
