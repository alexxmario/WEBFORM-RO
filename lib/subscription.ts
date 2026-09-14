export type SubscriptionProfile = {
  subscription_status?: string | null;
  subscription_expires_at?: string | null;
  role?: string | null;
};
export function hasSubscriptionAccess(
  profile: SubscriptionProfile | null | undefined,
  now = new Date(),
): boolean {
  return (
    !!profile &&
    ["active", "cancelled"].includes(profile.subscription_status || "") &&
    !!profile.subscription_expires_at &&
    new Date(profile.subscription_expires_at).getTime() > now.getTime()
  );
}
