import { HeaderAccountView } from "@/components/marketlab/header-account-view";
import { getAuthUser } from "@/lib/auth/session";
import { getCurrentProfile } from "@/lib/profile/queries";

export async function HeaderAccount() {
  const user = await getAuthUser();
  const profile = user ? await getCurrentProfile() : null;

  return (
    <HeaderAccountView isAuthenticated={Boolean(user)} profile={profile} />
  );
}
