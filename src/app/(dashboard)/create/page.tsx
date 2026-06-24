"use client";
// src/app/(dashboard)/create/page.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreationStore } from "@/store/creation";
import { UploadZone } from "@/components/create/UploadZone";
import { ProductForm } from "@/components/create/ProductForm";
import { TemplateSelector } from "@/components/create/TemplateSelector";
import { PromptBox } from "@/components/create/PromptBox";
import { FormatSelector } from "@/components/create/FormatSelector";
import { VoiceSelector } from "@/components/create/VoiceSelector";
import { GenerationProgress } from "@/components/create/GenerationProgress";
import { ScriptEditor } from "@/components/script/ScriptEditor";
import { StoryboardView } from "@/components/script/StoryboardView";
import { VideoPreview } from "@/components/video/VideoPreview";
import { MarketingCopyPanel } from "@/components/marketing/MarketingCopyPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Upload, FileText, Film, Share2, CheckCircle2,
  ArrowLeft, ArrowRight, Loader2
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Upload", icon: Upload },
  { id: 2, label: "Script", icon: FileText },
  { id: 3, label: "Generate", icon: Film },
  { id: 4, label: "Copy", icon: Share2 },
  { id: 5, label: "Done", icon: CheckCircle2 },
];

export default function CreatePage() {
  const { currentStep, setStep, isLoading } = useCreationStore();
  const [generating, setGenerating] = useState(false);

  const handleAnalyze = async () => {
    const {
      imageFile, imageUrl, productName, productDesc, targetAudience,
      style, template, setLoading, setError, setProjectId, setAnalysis, setStep: goStep
    } = useCreationStore.getState();

    if (!productName || !productDesc || !targetAudience) {
      setError("Fill in all required product fields.");
      return;
    }

    setLoading(true, "Uploading image...");
    setError(null);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile && !imageUrl) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        useCreationStore.getState().setImageUrl(data.data.imageUrl);
        finalImageUrl = data.data.imageUrl;
      }

      setLoading(true, "Analyzing product with AI...");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          productName, productDesc, targetAudience, style, template,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProjectId(data.data.projectId);
      setAnalysis(data.data.analysis);
      goStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze product");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    const {
      projectId, voiceLanguage, setLoading, setError,
      setScript, setStoryboard, setStep: goStep
    } = useCreationStore.getState();

    setLoading(true, "Generating marketing script...");
    setError(null);

    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, language: voiceLanguage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setScript(data.data.script);
      setStoryboard(data.data.storyboard);
      goStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Script generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    const {
      projectId, formats, resolution, voiceGender, voiceLanguage,
      musicMood, setLoading, setError, setVideoJobs, setStep: goStep
    } = useCreationStore.getState();

    setLoading(true, "Submitting video generation jobs...");
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId, formats, resolution, voiceGender,
          voiceLanguage, musicMood, videoProvider: "runway",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setVideoJobs(data.data.jobs.map((j: { jobId: string; format: string }) => ({
        jobId: j.jobId,
        provider: "runway",
        status: "queued" as const,
        progress: 0,
      })));

      goStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video generation failed");
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const handleGenerateCopy = async () => {
    const {
      projectId, voiceLanguage, setLoading, setError,
      setMarketingCopy, setStep: goStep
    } = useCreationStore.getState();

    setLoading(true, "Generating marketing copy...");
    setError(null);

    try {
      const res = await fetch("/api/marketing-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, language: voiceLanguage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMarketingCopy(data.data);
      goStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create Video Ad</h1>
        <p className="text-white/50 text-sm mt-1">Generate a high-converting product video in minutes</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                active ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" :
                done ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" :
                "text-white/30 border border-white/10"
              )}>
                <Icon className="w-3 h-3" />
                {step.label}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-px",
                  done ? "bg-emerald-500/30" : "bg-white/10"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <UploadZone />
              <ProductForm />
              <TemplateSelector />
              <PromptBox />
              <FormatSelector />
              <VoiceSelector />
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white py-3 text-base font-semibold"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
                ) : (
                  <><ArrowRight className="w-4 h-4 mr-2" />Analyze & Generate Script</>
                )}
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <ScriptEditor />
              <StoryboardView />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="border-white/10 text-white/70">
                  <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
                <Button
                  onClick={handleGenerateVideo}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><Film className="w-4 h-4 mr-2" />Generate Videos</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <GenerationProgress />
              <VideoPreview />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="border-white/10 text-white/70">
                  <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
                <Button
                  onClick={handleGenerateCopy}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating copy...</>
                  ) : (
                    <><Share2 className="w-4 h-4 mr-2" />Generate Marketing Copy</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <MarketingCopyPanel />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="border-white/10 text-white/70">
                  <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
                <Button
                  onClick={() => setStep(5)}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />Complete & Export
                </Button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your video is ready!</h2>
              <p className="text-white/50">Download your videos and marketing copy below.</p>
              <VideoPreview showExport />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
