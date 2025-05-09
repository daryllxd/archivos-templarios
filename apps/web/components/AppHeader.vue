<template>
  <header class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">Archivos Templarios</h1>
      <nav class="space-x-4">
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
      </nav>
    </div>
  </header>
</template>

<script setup>
const links = [
  { to: "/", text: "Home" },
  { to: "/quizzes", text: "Quizzes" },
  { to: "/about", text: "About" },
];
</script>
