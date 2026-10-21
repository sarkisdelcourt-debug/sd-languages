import { describe, expect, it } from "vitest";
import { isQueueableMutation } from "./offline";

describe("offline mutation safety", () => {
  it("queues only idempotent or context-checked writes", () => {
    expect(isQueueableMutation("/api/settings/en", "PATCH")).toBe(true);
    expect(isQueueableMutation("/api/practice/en-a1-mcq-have/answer", "POST")).toBe(true);
    expect(isQueueableMutation("/api/pronunciation/pron-en-cafe/attempts", "POST")).toBe(true);
    expect(isQueueableMutation("/api/lessons/en/answer", "POST")).toBe(true);
  });

  it("keeps ordered or non-idempotent workflows out of the queue", () => {
    expect(isQueueableMutation("/api/diagnostic/en", "POST")).toBe(false);
    expect(isQueueableMutation("/api/lessons/en/continue", "POST")).toBe(false);
    expect(isQueueableMutation("/api/lessons/en/message", "POST")).toBe(false);
    expect(isQueueableMutation("/api/reviews/card-1", "POST")).toBe(false);
    expect(isQueueableMutation("/api/conversations/en", "POST")).toBe(false);
  });
});
