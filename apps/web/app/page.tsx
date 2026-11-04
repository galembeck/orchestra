import { cn } from "@repo/ui/lib/utils";

// Placeholder that exercises the theme; replace with the landing page.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-6 px-5 py-24 sm:px-20">
      <span className="text-muted-foreground tracking-eyebrow font-mono text-xs font-medium uppercase">
        Orchestra · em construção
      </span>
      <h1 className="text-display-md sm:text-display-xl font-serif">
        Componha o serviço <em className="text-primary">certo</em>, na hora
        certa.
      </h1>
      <p className={cn("text-muted-foreground max-w-xl text-lg")}>
        Next.js, Tailwind CSS v4 e o tema compartilhado em{" "}
        <code className="text-foreground font-mono text-sm">
          config/tailwind-config
        </code>{" "}
        estão prontos.
      </p>
    </main>
  );
}
