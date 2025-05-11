import { ref } from "vue";

const isRecording = ref(false);
const audioUrl = ref(null);
const audioBlob = ref(null);
let mediaRecorder = null;
let audioChunks = [];
let stream = null;
let audioContext = null;
let sourceNode = null;
let gainNode = null;
let filterNode = null;
let destNode = null;

const startRecording = async () => {
  if (isRecording.value) return;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { sampleRate: 44100, channelCount: 2 },
    });

    // Web Audio API setup
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioContext.createMediaStreamSource(stream);
    gainNode = audioContext.createGain();
    gainNode.gain.value = 1.2; // Slight volume boost
    filterNode = audioContext.createBiquadFilter();
    filterNode.type = "highpass";
    filterNode.frequency.value = 120; // Cut below 120Hz
    destNode = audioContext.createMediaStreamDestination();

    // Connect nodes: mic -> gain -> filter -> destination
    sourceNode.connect(gainNode);
    gainNode.connect(filterNode);
    filterNode.connect(destNode);

    // Use the processed stream for recording
    mediaRecorder = new window.MediaRecorder(destNode.stream);
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
      if (audioContext) {
        audioContext.close();
        audioContext = null;
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
  if (audioContext) {
    audioContext.close();
    audioContext = null;
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
  if (audioContext) {
    audioContext.close();
    audioContext = null;
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
