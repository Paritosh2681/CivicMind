import { createClient } from "@/lib/supabase/client";

export const signInWithGoogle = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error logging in:", error.message);
  }
};

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = "/";
};