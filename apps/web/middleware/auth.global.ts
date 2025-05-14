// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (["/about", "/login", "/register"].includes(to.path)) {
    console.log("allowed");
    return;
  }
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo("/login");
  }
});
