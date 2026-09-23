/** Server-only delivery. Never log fetch errors: their URL contains the bot token. */
export async function notifyTelegram(text: string): Promise<"sent" | "not_configured" | "failed"> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return "not_configured";
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: Array.from(text).slice(0, 4000).join(""),
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error("Delivery failed");
    return "sent";
  } catch {
    console.error("Telegram notification failed; submission remains saved.");
    return "failed";
  }
}
