import Aura from "@primeuix/themes/aura";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

/* https://nuxt.com/docs/api/configuration/nuxt-config */
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  components: [
    { path: "~/components", pathPrefix: false },
    { path: "~/components/ui", pathPrefix: false },
  ],
  plugins: ["~/plugins/theme.client.ts", "~/plugins/vue-query.ts"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  devtools: { enabled: true },
  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  supabase: {
    redirect: false,
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxtjs/supabase",
    "shadcn-nuxt",
    "@primevue/nuxt-module",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
  ],
  ui: {
    darkMode: false,
  },
  i18n: {
    defaultLocale: "en",
    langDir: "./locales/",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "es", name: "Español", file: "es.json" },
    ],
  },
  shadcn: {
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
    darkMode: false,
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
    components: {
      include: ["Dropdown", "ToggleSwitch", "InputText", "Textarea"],
    },
  },
});
