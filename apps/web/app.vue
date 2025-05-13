<template>
  <div>
    <AppHeader />
    <main class="container mx-auto p-4">
      <ul>
        <li v-for="instrument in instruments" :key="instrument.id">
          {{ instrument.name }}
        </li>
      </ul>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { createClient } from "@supabase/supabase-js";
import AppHeader from "./components/AppHeader.vue";

const config = useRuntimeConfig();

const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
);
const instruments = ref([]);
async function getInstruments() {
  const { data, error } = await supabase.from("instruments").select();

  console.log("data", data);
  if (error) {
    console.error("Supabase error:", error);
  }
  instruments.value = data;
}
onMounted(() => {
  getInstruments();
});
</script>
