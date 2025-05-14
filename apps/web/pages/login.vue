<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);

const signInWithPassword = async () => {
  errorMsg.value = "";
  loading.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      // Handle error, e.g., show a message to the user
      errorMsg.value = error.message;
    }
  } catch (error) {
    // Handle unexpected errors
    const message = error instanceof Error ? error.message : String(error);
    errorMsg.value = message;
  } finally {
    loading.value = false;
  }
};

// const signOut = async () => {
//   const { error } = await supabase.auth.signOut();
//   if (error) console.log(error);
// };
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <form
      class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      @submit.prevent="signInWithPassword"
    >
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Password</label
        >
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
      <div v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
      >
        <svg
          v-if="loading"
          class="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>{{ loading ? "Signing in..." : "Sign in" }}</span>
      </button>
    </form>
  </div>
</template>
