import { getAuthUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Profile = {
  balance_cents: number;
  first_name: string;
  last_name: string;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const user = await getAuthUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("balance_cents, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}
