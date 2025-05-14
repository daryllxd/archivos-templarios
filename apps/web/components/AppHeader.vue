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
        <button
          v-if="user"
          class="ml-2 text-sm underline hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded transition"
          aria-label="Sign out"
          @click="handleSignOut"
        >
          Sign out
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { useRouter } from "vue-router";

const links = [
  { to: "/", text: "Home" },
  { to: "/register", text: "Register" },
  { to: "/quizzes", text: "Quizzes" },
  { to: "/about", text: "About" },
];

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

const handleSignOut = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
</script>
