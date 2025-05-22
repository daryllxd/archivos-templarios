import { defineNuxtPlugin } from "#app";
import {
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const options: VueQueryPluginOptions = {
    enableDevtoolsV6Plugin: process.env.NODE_ENV !== "production",
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    },
  };

  nuxtApp.vueApp.use(VueQueryPlugin, options);
});
