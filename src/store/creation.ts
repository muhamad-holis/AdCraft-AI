// src/store/creation.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  CreationState,
  VideoStyle,
  VideoFormat,
  VideoResolution,
  VoiceGender,
  Language,
  MusicMood,
  ProductAnalysis,
  ScriptOutput,
  StoryboardOutput,
  MarketingCopyOutput,
  VideoGenerationJob,
} from "@/types";

interface CreationActions {
  // Setters
  setStep: (step: number) => void;
  setProductName: (v: string) => void;
  setProductDesc: (v: string) => void;
  setTargetAudience: (v: string) => void;
  setCustomPrompt: (v: string) => void;
  setImageFile: (file: File, preview: string) => void;
  setImageUrl: (url: string) => void;
  setStyle: (style: VideoStyle) => void;
  setTemplate: (id: string | null) => void;
  toggleFormat: (format: VideoFormat) => void;
  setResolution: (r: VideoResolution) => void;
  setVoiceGender: (g: VoiceGender) => void;
  setVoiceLanguage: (l: Language) => void;
  setMusicMood: (m: MusicMood) => void;

  // AI Results
  setProjectId: (id: string) => void;
  setAnalysis: (a: ProductAnalysis) => void;
  setScript: (s: ScriptOutput) => void;
  setStoryboard: (s: StoryboardOutput) => void;
  setMarketingCopy: (c: MarketingCopyOutput) => void;
  setVideoJobs: (jobs: VideoGenerationJob[]) => void;
  updateVideoJob: (jobId: string, update: Partial<VideoGenerationJob>) => void;

  // UI
  setLoading: (loading: boolean, step?: string) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

const initialState: CreationState = {
  currentStep: 1,
  productName: "",
  productDesc: "",
  targetAudience: "",
  customPrompt: "",
  imageFile: null,
  imagePreview: null,
  imageUrl: null,
  style: "MODERN",
  template: null,
  formats: ["TIKTOK_916", "INSTAGRAM_11"],
  resolution: "FHD_1080P",
  voiceGender: "female",
  voiceLanguage: "INDONESIAN",
  musicMood: "energetic",
  projectId: null,
  analysis: null,
  script: null,
  storyboard: null,
  marketingCopy: null,
  videoJobs: [],
  isLoading: false,
  loadingStep: null,
  error: null,
};

export const useCreationStore = create<CreationState & CreationActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setStep: (currentStep) => set({ currentStep }),
      setProductName: (productName) => set({ productName }),
      setProductDesc: (productDesc) => set({ productDesc }),
      setTargetAudience: (targetAudience) => set({ targetAudience }),
      setCustomPrompt: (customPrompt) => set({ customPrompt }),
      setImageFile: (imageFile, imagePreview) => set({ imageFile, imagePreview }),
      setImageUrl: (imageUrl) => set({ imageUrl }),
      setStyle: (style) => set({ style }),
      setTemplate: (template) => set({ template }),
      toggleFormat: (format) =>
        set((s) => ({
          formats: s.formats.includes(format)
            ? s.formats.filter((f) => f !== format)
            : [...s.formats, format],
        })),
      setResolution: (resolution) => set({ resolution }),
      setVoiceGender: (voiceGender) => set({ voiceGender }),
      setVoiceLanguage: (voiceLanguage) => set({ voiceLanguage }),
      setMusicMood: (musicMood) => set({ musicMood }),

      setProjectId: (projectId) => set({ projectId }),
      setAnalysis: (analysis) => set({ analysis }),
      setScript: (script) => set({ script }),
      setStoryboard: (storyboard) => set({ storyboard }),
      setMarketingCopy: (marketingCopy) => set({ marketingCopy }),
      setVideoJobs: (videoJobs) => set({ videoJobs }),
      updateVideoJob: (jobId, update) =>
        set((s) => ({
          videoJobs: s.videoJobs.map((j) =>
            j.jobId === jobId ? { ...j, ...update } : j
          ),
        })),

      setLoading: (isLoading, loadingStep = null) =>
        set({ isLoading, loadingStep }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    { name: "creation-store" }
  )
);
