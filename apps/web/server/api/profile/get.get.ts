import { serverSupabaseClient } from "#supabase/server";
import { createError } from "h3";
import type { Database } from "~/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw createError({
        statusCode: 500,
        message: "Failed to fetch profile",
      });
    }

    return {
      success: true,
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch profile",
    });
  }
});
