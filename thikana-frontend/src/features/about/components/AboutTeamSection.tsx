import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { aboutTeamMembers } from "@/features/about/data/about.mock";

export function AboutTeamSection() {
  return (
    <section
      className="bg-surface py-12 sm:py-16 lg:py-[70px]"
      aria-labelledby="about-team-heading"
    >
      <Container>
        <div className="flex flex-col items-center gap-6">
          <h2
            id="about-team-heading"
            className="w-full text-center font-jakarta text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-brand-dark"
          >
            The People Behind Thikana
          </h2>

          <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutTeamMembers.map((member) => (
              <li
                key={member.id}
                className="flex flex-col items-center gap-5 rounded-xl bg-white p-6"
              >
                <div className="relative size-24 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 text-center text-brand-dark">
                  <h3 className="font-inter text-lg font-bold">{member.name}</h3>
                  <p className="font-inter text-sm">{member.role}</p>
                </div>
                <a
                  href={member.linkedInHref}
                  aria-label={`${member.name} on LinkedIn`}
                  className="inline-flex size-5 items-center justify-center transition-opacity hover:opacity-70"
                >
                  <Image
                    src="/images/about/icon-linkedin.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
