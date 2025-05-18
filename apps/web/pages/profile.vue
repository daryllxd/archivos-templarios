<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {{ t("profile.title") }}
      </h1>

      <div
        v-if="user"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <!-- Profile Header -->
        <div class="flex items-center space-x-4 mb-6">
          <div
            class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
          >
            <Icon
              name="ph:user-circle-bold"
              class="w-12 h-12 text-gray-400 dark:text-gray-500"
            />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ user.email }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("profile.memberSince") }} {{ formatDate(user.created_at) }}
            </p>
          </div>
        </div>

        <!-- Profile Form -->
        <ProfileForm :user="user" @update="handleProfileUpdate" />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">
          {{ t("profile.loading") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from "#imports";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

interface User {
  id: string;
  email: string;
  created_at: string;
  biography?: string;
  country?: string;
}

interface ProfileUpdate {
  biography?: string;
  country?: string;
}

const { t } = useI18n();
const supabase = useSupabaseClient();
const user = ref<User | null>(null);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const handleProfileUpdate = async (updatedData: ProfileUpdate) => {
  if (!user.value) return;

  // Just update the local state for now
  user.value = {
    ...user.value,
    ...updatedData,
  };
};

const fetchUser = async () => {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;

    user.value = {
      id: authUser.id,
      email: authUser.email!,
      created_at: authUser.created_at,
      biography: "",
      country: "",
    };
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

onMounted(() => {
  fetchUser();
});
</script>
