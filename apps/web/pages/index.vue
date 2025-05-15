<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from "#components";
import VueTypewriterEffect from "vue-typewriter-effect";

const user = useSupabaseUser();

if (user.value) {
  navigateTo("/quizzes");
}

const sellingPoints = [
  {
    title: "Learn Through Familiar Content",
    description:
      "Master Spanish by engaging with topics you already love. Whether it's Magic: The Gathering, Starcraft, or Pokémon, learning becomes natural and enjoyable.",
    icon: "i-heroicons-academic-cap",
  },
  {
    title: "Contextual Learning",
    description:
      "Understanding language in context makes it stick. Our quizzes use real-world scenarios from your favorite games and hobbies.",
    icon: "i-heroicons-light-bulb",
  },
  {
    title: "Progress Through Passion",
    description:
      "Stay motivated by learning Spanish through subjects you're passionate about. Turn your gaming knowledge into language mastery.",
    icon: "i-heroicons-chart-bar",
  },
];
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">
        Learn Spanish with
        <vue-typewriter-effect
          :strings="['Magic', 'Starcraft', 'Pokémon']"
          :delay="100"
          :pause-for="500"
          :delete-speed="50"
          class="text-primary"
        />
      </h1>
      <p class="text-lg text-muted-foreground">
        Your gateway to language mastery through gaming.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <Card
        v-for="point in sellingPoints"
        :key="point.title"
        class="hover:shadow-lg transition-shadow"
      >
        <CardHeader>
          <div
            class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <div :class="point.icon" class="w-6 h-6 text-primary" />
          </div>
          <CardTitle>{{ point.title }}</CardTitle>
          <CardDescription>{{ point.description }}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
