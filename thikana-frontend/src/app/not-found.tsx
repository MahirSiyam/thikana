import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-start justify-center py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        href={routes.home}
        className="mt-8 inline-flex items-center rounded-(--radius) bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Back to home
      </Link>
    </Container>
  );
}
