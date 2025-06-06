<template>
  <header class="bg-gray-800 dark:bg-gray-900 text-white p-4">
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
        <div class="w-[200px]">
          <LanguageSwitcher />
        </div>
        <ThemeSwitcher />
        <NuxtLink
          v-if="!user"
          to="/login"
          class="hover:text-gray-300"
          :class="{
            'text-amber-400 [&:hover]:text-amber-600': $route.path === '/login',
          }"
        >
          {{ t("login") }}
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
            :aria-label="t('signOut')"
            @click="handleSignOut"
          >
            {{ t("signOut") }}
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import ThemeSwitcher from "./header/ThemeSwitcher.vue";

const { t } = useI18n();

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

const links = computed(() =>
  [
    { to: "/", text: t("home") },
    user.value ? { to: "/quizzes", text: t("quizzes") } : null,
    { to: "/magic-quiz", text: "Magic Quiz" },
    { to: "/about", text: t("about") },
    !user.value ? { to: "/register", text: t("register") } : null,
  ].filter(Boolean)
);

const avatarUrl = computed(() => {
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
