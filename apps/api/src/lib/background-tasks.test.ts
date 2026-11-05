import { describe, expect, it, vi } from "vitest";
import { createBackgroundTasks } from "./background-tasks.js";

describe("createBackgroundTasks", () => {
  it("waits for every tracked task, including ones added while draining", async () => {
    const tasks = createBackgroundTasks(vi.fn());
    const completed: string[] = [];

    tasks.track(
      (async () => {
        await Promise.resolve();
        completed.push("first");
        tasks.track(
          (async () => {
            await Promise.resolve();
            completed.push("second");
          })()
        );
      })()
    );

    await tasks.drain();

    expect(completed).toEqual(["first", "second"]);
  });

  it("reports failures without rejecting the drain", async () => {
    const onError = vi.fn();
    const tasks = createBackgroundTasks(onError);
    const failure = new Error("smtp down");

    tasks.track(Promise.reject(failure));

    await expect(tasks.drain()).resolves.toBeUndefined();
    expect(onError).toHaveBeenCalledWith(failure);
  });
});
