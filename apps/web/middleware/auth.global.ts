// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const allowedRoutes = [
    "/auth/callback",
    "/about",
    "/login",
    "/register",
    "/",
  ];

  if (allowedRoutes.includes(to.path)) {
    console.log("allowed");
    return;
  }
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo("/login");
  }
});
