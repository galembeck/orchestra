import { REVIEWER_AVATARS } from "@orchestra/shared/constants/hero";
import Image from "next/image";

const AVATAR_SIZE_PX = 36;

export function AvatarStack() {
  return (
    <div aria-hidden="true" className="flex shrink-0 items-center">
      {REVIEWER_AVATARS.map((src) => (
        <Image
          alt=""
          className="ring-background bg-muted size-7 rounded-full object-cover ring-3 not-first:-ml-2 lg:size-9 lg:not-first:-ml-2.5"
          height={AVATAR_SIZE_PX}
          key={src}
          src={src}
          width={AVATAR_SIZE_PX}
        />
      ))}
    </div>
  );
}
