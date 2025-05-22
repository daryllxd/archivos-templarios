<template>
  <FormKit type="form" :actions="false" class="mb-6" @submit="handleSubmit">
    <div class="grid md:grid-cols-2 gap-4">
      <FormKit
        type="select"
        name="language"
        label="Card Language"
        :options="[
          { label: 'English', value: 'en' },
          { label: 'Spanish', value: 'es' },
          { label: 'Japanese', value: 'ja' },
          { label: 'French', value: 'fr' },
          { label: 'German', value: 'de' },
          { label: 'Italian', value: 'it' },
          { label: 'Portuguese', value: 'pt' },
          { label: 'Russian', value: 'ru' },
          { label: 'Korean', value: 'ko' },
          { label: 'Chinese Simplified', value: 'zhs' },
          { label: 'Chinese Traditional', value: 'zht' },
        ]"
        validation="required"
        validation-label="Language"
        :value="modelValue.language"
        @input="updateValue('language', $event)"
      />

      <FormKit
        type="select"
        name="set"
        label="Card Set"
        :options="[
          { label: 'Modern Horizons 3', value: 'mh3' },
          { label: 'Murders at Karlov Manor', value: 'mkm' },
          { label: 'The Lost Caverns of Ixalan', value: 'lci' },
          { label: 'Wilds of Eldraine', value: 'woe' },
          { label: 'March of the Machine', value: 'mom' },
          { label: 'Phyrexia: All Will Be One', value: 'one' },
          { label: 'The Brothers\' War', value: 'bro' },
          { label: 'Dominaria United', value: 'dmu' },
        ]"
        validation="required"
        validation-label="Set"
        :value="modelValue.set"
        @input="updateValue('set', $event)"
      />
    </div>
  </FormKit>
</template>

<script setup lang="ts">
interface CardFormData {
  language: string;
  set: string;
}

interface Props {
  modelValue: CardFormData;
}

interface Emits {
  (e: "update:modelValue", value: CardFormData): void;
  (e: "submit", value: CardFormData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const updateValue = (key: keyof CardFormData, value: string) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
};

const handleSubmit = (formData: CardFormData) => {
  emit("submit", formData);
};
</script>
