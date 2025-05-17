export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode();
  nuxtApp.hook("app:mounted", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    colorMode.preference = savedTheme;
    colorMode.value = savedTheme;
  });
});
