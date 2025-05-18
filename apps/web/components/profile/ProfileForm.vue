<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Name -->
    <div>
      <label
        for="name"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ t("profile.name") }}
      </label>
      <div class="mt-1">
        <InputText
          id="name"
          v-model="formData.name"
          class="w-full"
          :maxlength="50"
          :placeholder="t('profile.namePlaceholder')"
        />
      </div>
    </div>

    <!-- URL -->
    <div>
      <label
        for="url"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ t("profile.url") }}
      </label>
      <div class="mt-1">
        <InputText
          id="url"
          v-model="formData.url"
          class="w-full"
          :maxlength="50"
          :placeholder="t('profile.urlPlaceholder')"
        />
      </div>
    </div>

    <!-- Biography -->
    <div>
      <label
        for="biography"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ t("profile.biography") }}
      </label>
      <div class="mt-1">
        <TextArea
          id="biography"
          v-model="formData.biography"
          class="w-full"
          :rows="4"
          :placeholder="t('profile.biographyPlaceholder')"
        />
      </div>
    </div>

    <!-- Country -->
    <div>
      <label
        for="country"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ t("profile.country") }}
      </label>
      <div class="mt-1">
        <select
          id="country"
          v-model="formData.country"
          class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        >
          <option value="">{{ t("profile.selectCountry") }}</option>
          <option
            v-for="country in countries"
            :key="country.code"
            :value="country.code"
          >
            {{ country.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">
          {{ t("common.saving") }}
        </span>
        <span v-else>
          {{ t("common.save") }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  user: {
    id: string;
    name?: string;
    url?: string;
    biography?: string;
    country?: string;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (
    e: "update",
    data: {
      name?: string;
      url?: string;
      biography?: string;
      country?: string;
    }
  ): void;
}>();

const { t } = useI18n();
const isSubmitting = ref(false);

const formData = ref({
  name: props.user.name || "",
  url: props.user.url || "",
  biography: props.user.biography || "",
  country: props.user.country || "",
});

// List of countries - you might want to move this to a separate file
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
];

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    emit("update", {
      name: formData.value.name,
      url: formData.value.url,
      biography: formData.value.biography,
      country: formData.value.country,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
