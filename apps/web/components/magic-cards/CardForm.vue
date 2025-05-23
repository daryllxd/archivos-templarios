<template>
  <FormKit type="form" :actions="false" class="mb-6" @submit="handleSubmit">
    <div class="grid md:grid-cols-2 gap-4">
      <FormKit
        type="select"
        name="language"
        label="Card Language"
        :options="MAGIC_LANGUAGES.filter((lang) => lang.value !== 'en')"
        validation="required"
        validation-label="Language"
        :value="modelValue.language"
      >
        <template #input="context">
          <Dropdown
            :model-value="context.value"
            :options="MAGIC_LANGUAGES.filter((lang) => lang.value !== 'en')"
            option-label="label"
            option-value="value"
            placeholder="Select a language"
            class="w-full"
            :class="{
              'p-invalid': context.node.context?.state.valid === false,
            }"
            @update:model-value="(val: string) => context.node.input(val)"
          />
        </template>
      </FormKit>

      <FormKit
        type="select"
        name="set"
        label="Card Set"
        :options="MAGIC_SETS"
        validation="required"
        validation-label="Set"
        :value="modelValue.set"
      >
        <template #input="context">
          <Dropdown
            :model-value="context.value"
            :options="MAGIC_SETS"
            option-label="label"
            option-value="value"
            placeholder="Select a set"
            class="w-full"
            :class="{
              'p-invalid': context.node.context?.state.valid === false,
            }"
            @update:model-value="(val: string) => context.node.input(val)"
          />
        </template>
      </FormKit>
    </div>

    <div class="mt-4">
      <Button
        type="submit"
        label="Get Random Card"
        icon="pi pi-refresh"
        class="w-full md:w-auto"
      />
    </div>
  </FormKit>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { CardOptions } from "~/composables/useMagicCards";
import { MAGIC_LANGUAGES, MAGIC_SETS } from "~/constants/magic";

interface Props {
  modelValue: CardOptions;
}

type EmitType = {
  (e: "update:modelValue" | "submit", value: CardOptions): void;
};

const props = defineProps<Props>();
const emit = defineEmits<EmitType>();

const formData = ref<CardOptions>({
  language: props.modelValue.language,
  set: props.modelValue.set,
});

watch(
  formData,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

const handleSubmit = (formData: CardOptions) => {
  emit("submit", formData);
};
</script>
