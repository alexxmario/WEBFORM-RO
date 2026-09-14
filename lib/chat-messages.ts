export type ChatMessage = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender_email?: string;
};
export function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const messages = new Map(current.map((m) => [m.id, m]));
  incoming.forEach((m) => messages.set(m.id, m));
  return [...messages.values()].sort(
    (a, b) =>
      a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id),
  );
}
