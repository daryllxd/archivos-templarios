import { defineNuxtPlugin } from "#app";
import { VueQueryPlugin } from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
  });
});
