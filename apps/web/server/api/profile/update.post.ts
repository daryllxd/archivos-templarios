import { serverSupabaseClient } from "#supabase/server";
import { createError, defineEventHandler, readBody } from "h3";
import type { Database } from "~/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, url, biography, country } = body;

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

    const updateData: ProfileUpdate = {
      name,
      url,
      biography,
      country,
      updated_at: new Date().toISOString(),
    };

    // Update the user profile
    const { data: updatedUser, error: updateError } = await client
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: "Failed to update profile",
      });
    }

    return {
      success: true,
      user: updatedUser as Profile,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update profile",
    });
  }
});
