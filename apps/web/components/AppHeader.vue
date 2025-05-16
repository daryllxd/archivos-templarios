<template>
  <header class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">Archivos Templarios</h1>
      <nav class="space-x-4 flex items-center">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'hover:text-gray-300',
            {
              'text-amber-400 [&:hover]:text-amber-600':
                $route.path === link.to,
            },
          ]"
        >
          {{ link.text }}
        </NuxtLink>
        <div class="w-40">
          <LanguageSwitcher />
        </div>
        <NuxtLink
          v-if="!user"
          to="/login"
          class="hover:text-gray-300"
          :class="{
            'text-amber-400 [&:hover]:text-amber-600': $route.path === '/login',
          }"
        >
          Login
        </NuxtLink>
        <div v-if="user" class="flex items-center gap-2">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="User avatar"
            class="w-8 h-8 rounded-full border border-white shadow"
            referrerpolicy="no-referrer"
          />
          <button
            class="ml-2 text-sm underline hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded transition"
            aria-label="Sign out"
            @click="handleSignOut"
          >
            Sign out
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { computed as vueComputed } from "vue";
import { useRouter } from "vue-router";
import LanguageSwitcher from "./LanguageSwitcher.vue";

const { $i18n } = useNuxtApp();

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

const links = [
  { to: "/", text: $i18n.t("home") },
  user.value ? { to: "/quizzes", text: "Quizzes" } : null,
  { to: "/about", text: "About" },
  !user.value ? { to: "/register", text: "Register" } : null,
].filter(Boolean);

const avatarUrl = vueComputed(() => {
  if (!user.value) return null;
  // Google OAuth: avatar_url or picture
  return (
    user.value.user_metadata?.avatar_url ||
    user.value.user_metadata?.picture ||
    null
  );
});

const handleSignOut = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
</script>
