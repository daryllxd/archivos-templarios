<script setup lang="ts">
import { useSupabaseUser } from "#imports";
import { useRouter } from "vue-router";

const router = useRouter();
const user = useSupabaseUser();

// This is a workaround to ensure the user is logged in before redirecting
watch(
  user,
  (newUser) => {
    if (newUser) {
      router.replace("/quizzes");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <span class="text-gray-600">Processing authentication...</span>
  </div>
</template>
