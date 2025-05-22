<template>
  <VueQueryDevtools />

  <div>
    <AppHeader />
    <main class="container mx-auto p-4">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { createClient } from "@supabase/supabase-js";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import AppHeader from "./components/AppHeader.vue";

const config = useRuntimeConfig();

const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);

interface Instrument {
  id: number;
  name: string;
  // Add other instrument properties as needed
}

const instruments = ref<Instrument[]>([]);

async function getInstruments() {
  const { data, error } = await supabase.from("instruments").select();

  console.log("data", data);
  if (error) {
    console.error("Supabase error:", error);
  }
  instruments.value = data || [];
}

onMounted(() => {
  getInstruments();
});
</script>

<style>
@import "~/assets/css/main.css";
</style>
