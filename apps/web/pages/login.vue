<script setup lang="ts">
defineNuxtRouteMiddleware((_to, _from) => {
  const user = useSupabaseUser();
  if (user.value) {
    return navigateTo("/");
  }
});

const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);
const googleLoading = ref(false);

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
    } else {
      navigateTo("/");
    }
  } catch (error) {
    // Handle unexpected errors
    const message = error instanceof Error ? error.message : String(error);
    errorMsg.value = message;
  } finally {
    loading.value = false;
  }
};

const signInWithGoogle = async () => {
  errorMsg.value = "";
  googleLoading.value = true;
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      errorMsg.value = error.message;
    }
    // On success, Supabase will redirect to the configured callback URL
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errorMsg.value = message;
  } finally {
    googleLoading.value = false;
  }
};
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
        :disabled="loading || googleLoading"
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
      <div class="flex items-center my-2">
        <div class="flex-grow border-t border-gray-200" />
        <span class="mx-2 text-gray-400 text-xs">or</span>
        <div class="flex-grow border-t border-gray-200" />
      </div>
      <button
        type="button"
        :disabled="googleLoading || loading"
        class="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Sign in with Google"
        @click="signInWithGoogle"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"
              fill="#FFC107"
            />
            <path
              d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 6.5-11.7 6.5-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"
              fill="#FF3D00"
            />
            <path
              d="M24 45c5.8 0 11.1-2 15.2-5.4l-7-5.8C29.6 35.7 26.9 37 24 37c-5.7 0-10.5-3.8-12.2-9.1l-7 5.4C6.6 41.2 14.7 45 24 45z"
              fill="#4CAF50"
            />
            <path
              d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 6.5-11.7 6.5-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-1.7-.2-3.3-.5-4.5z"
              fill="none"
            />
          </g>
        </svg>
        <span>{{
          googleLoading ? "Signing in with Google..." : "Sign in with Google"
        }}</span>
      </button>
    </form>
  </div>
</template>
