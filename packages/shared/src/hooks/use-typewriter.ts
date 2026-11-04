"use client";

import { useEffect, useState } from "react";

export interface TypewriterOptions {
  deleteDelayMs?: number;
  enabled?: boolean;
  holdDelayMs?: number;
  typeDelayMs?: number;
}

export function useTypewriter(
  phrases: readonly string[],
  {
    deleteDelayMs = 28,
    enabled = true,
    holdDelayMs = 1800,
    typeDelayMs = 55,
  }: TypewriterOptions = {}
): string {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrase = phrases[phraseIndex % Math.max(phrases.length, 1)] ?? "";

  useEffect(() => {
    if (!enabled || phrases.length === 0) {
      return;
    }

    const finishedTyping = !isDeleting && visibleLength === phrase.length;
    const finishedDeleting = isDeleting && visibleLength === 0;

    let delay = isDeleting ? deleteDelayMs : typeDelayMs;
    if (finishedTyping) {
      delay = holdDelayMs;
    }

    const timeout = window.setTimeout(() => {
      if (finishedTyping) {
        setIsDeleting(true);
        return;
      }

      if (finishedDeleting) {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
        return;
      }

      setVisibleLength((length) => length + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    deleteDelayMs,
    enabled,
    holdDelayMs,
    isDeleting,
    phrase.length,
    phrases.length,
    typeDelayMs,
    visibleLength,
  ]);

  if (!enabled) {
    return phrase;
  }

  return phrase.slice(0, visibleLength);
}
