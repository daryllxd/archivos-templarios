import { ref } from "vue";

const isRecording = ref(false);
const audioUrl = ref(null);
const audioBlob = ref(null);
let mediaRecorder = null;
let audioChunks = [];
let stream = null;

const startRecording = async () => {
  if (isRecording.value) return;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { sampleRate: 44100, channelCount: 2 },
    });
    mediaRecorder = new window.MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      audioBlob.value = blob;
      audioUrl.value = URL.createObjectURL(blob);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
    };
    mediaRecorder.start();
    isRecording.value = true;
  } catch {
    alert("Microphone access denied or not available.");
  }
};

const stopRecording = () => {
  if (!isRecording.value || !mediaRecorder) return;
  mediaRecorder.stop();
  isRecording.value = false;
  // Ensure stream is stopped even if onstop is not called
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
};

const resetRecording = () => {
  audioUrl.value = null;
  audioBlob.value = null;
  audioChunks = [];
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
};

export default function useMicrophone() {
  return {
    isRecording,
    audioUrl,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
