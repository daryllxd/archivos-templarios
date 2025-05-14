<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMsg = ref("");
const successMsg = ref("");

const register = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match.";
    return;
  }
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) {
      errorMsg.value = error.message;
    } else {
      successMsg.value =
        "Registration successful! Please check your email to confirm your account.";
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errorMsg.value = message;
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <form
      class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      @submit.prevent="register"
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
          autocomplete="new-password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
      <div>
        <label
          for="confirmPassword"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Confirm Password</label
        >
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          autocomplete="new-password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
      <div v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</div>
      <div v-if="successMsg" class="text-green-600 text-sm">
        {{ successMsg }}
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Register
      </button>
    </form>
  </div>
</template>
