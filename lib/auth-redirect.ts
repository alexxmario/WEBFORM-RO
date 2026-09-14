/** Only allow local application paths after authentication. */
export function safeAuthRedirect(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/subscribe";
  return value;
}
