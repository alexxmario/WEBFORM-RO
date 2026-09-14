import { it, expect } from "vitest";
import { mergeMessages } from "@/lib/chat-messages";
it("deduplicates a sent message also delivered through realtime", () => {
  const m = {
    id: "a",
    content: "hello",
    created_at: "2026-09-12T10:00:00Z",
    sender_id: "user",
  };
  expect(mergeMessages([m], [m])).toEqual([m]);
});
it("keeps a newly received message when the historical request finishes later", () => {
  const first = {
    id: "a",
    content: "old",
    created_at: "2026-09-12T10:00:00Z",
    sender_id: "user",
  };
  const next = { ...first, id: "b", created_at: "2026-09-12T11:00:00Z" };
  expect(mergeMessages([next], [first]).map((m) => m.id)).toEqual(["a", "b"]);
});
