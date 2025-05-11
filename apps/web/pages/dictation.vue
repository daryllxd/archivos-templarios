<template>
  <div class="container mx-auto max-w-2xl py-10 px-4">
    <h1 class="text-3xl font-bold mb-6">Dictation Tool</h1>
    <form @submit.prevent="handleProcessDictation" class="space-y-6">
      <div>
        <label for="dictation-text" class="block text-lg font-medium mb-2"
          >Paste or type your dictation text below:</label
        >
        <textarea
          id="dictation-text"
          v-model="dictationText"
          rows="8"
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Paste or type here..."
          aria-label="Dictation text area"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="Process Dictation"
        tabindex="0"
      >
        Process Dictation
      </button>
    </form>

    <!-- Microphone Recording Section -->
    <div class="mt-10 space-y-4">
      <h2 class="text-2xl font-semibold mb-2">Or record your dictation:</h2>
      <div class="flex gap-4 items-center">
        <button
          @click="isRecording ? handleStopRecording() : handleStartRecording()"
          :class="
            isRecording
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          "
          class="text-white px-6 py-2 rounded-lg transition-colors"
          :aria-label="isRecording ? 'Stop recording' : 'Start recording'"
          tabindex="0"
        >
          {{ isRecording ? "Stop Recording" : "Start Recording" }}
        </button>
        <span
          v-if="isRecording"
          class="text-lg font-mono text-gray-700 ml-2"
          aria-live="polite"
        >
          {{ formattedDuration }}
        </span>
        <button
          v-if="audioUrl"
          @click="handleResetRecording"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          aria-label="Reset recording"
          tabindex="0"
        >
          Reset
        </button>
      </div>
      <div v-if="audioUrl" class="flex flex-col gap-2 items-start mt-4">
        <audio
          :src="audioUrl"
          controls
          class="w-full"
          aria-label="Playback recorded audio"
        ></audio>
        <a
          :href="audioUrl"
          download="dictation.webm"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Download recording"
          tabindex="0"
        >
          Download Recording
        </a>
      </div>
      <div v-if="recordings.length > 0" class="mt-8">
        <h3 class="text-xl font-semibold mb-2">Previous Recordings</h3>
        <ul class="space-y-4">
          <li
            v-for="(rec, idx) in recordings"
            :key="rec.url"
            class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-gray-50 p-4 rounded-lg shadow"
          >
            <span class="text-gray-700 font-mono">#{{ idx + 1 }}</span>
            <audio
              :src="rec.url"
              controls
              class="flex-1"
              :aria-label="`Playback recording ${idx + 1}`"
            ></audio>
            <span class="text-gray-500">{{
              formatDuration(rec.duration)
            }}</span>
            <a
              :href="rec.url"
              :download="`dictation-${idx + 1}.webm`"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              :aria-label="`Download recording ${idx + 1}`"
              tabindex="0"
            >
              Download
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Placeholder for future audio features -->
    <div class="mt-8 text-gray-500 text-center">
      <span>Audio dictation features coming soon...</span>
    </div>
  </div>
</template>

<script setup>
import useMicrophone from "@/composables/useMicrophone";
import { computed, ref } from "vue";

const dictationText = ref("");

const handleProcessDictation = () => {
  if (!dictationText.value.trim()) return;
  alert("Dictation processed! (placeholder)");
};

const {
  isRecording,
  audioUrl,
  recordingDuration,
  recordings,
  startRecording,
  stopRecording,
  resetRecording,
} = useMicrophone();

const formattedDuration = computed(() =>
  formatDuration(recordingDuration.value)
);

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const handleStartRecording = () => {
  resetRecording();
  startRecording();
};

const handleStopRecording = () => {
  stopRecording();
};

const handleResetRecording = () => {
  resetRecording();
};
</script>
