export interface AuthFormHeaderProps {
  description: string;
  title: string;
}

export function AuthFormHeader({ description, title }: AuthFormHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-foreground font-serif text-[40px]/11 font-normal tracking-tight lg:text-5xl/13">
        {title}
      </h1>

      <p className="text-muted-foreground text-base/6">{description}</p>
    </div>
  );
}
