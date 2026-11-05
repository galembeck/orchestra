export interface BackgroundTasks {
  drain: () => Promise<void>;
  track: (task: Promise<unknown>) => void;
}

export const createBackgroundTasks = (
  onError: (error: unknown) => void
): BackgroundTasks => {
  const pending = new Set<Promise<unknown>>();

  const drain = async (): Promise<void> => {
    if (pending.size === 0) {
      return;
    }

    await Promise.allSettled(pending);
    await drain();
  };

  return {
    drain,
    track: (task) => {
      const tracked = task.catch(onError).finally(() => {
        pending.delete(tracked);
      });

      pending.add(tracked);
    },
  };
};
