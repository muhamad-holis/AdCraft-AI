"use client";
// src/components/video/VideoPlayer.tsx

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Download, Maximize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  format?: string;
}

export function VideoPlayer({ src, poster, format }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    videoRef.current?.requestFullscreen();
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
      />

      {format && (
        <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-black/60 text-white/70">
          {format}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={togglePlay} className="text-white">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={toggleMute} className="text-white">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="flex-1" />
        <a href={src} download className="text-white">
          <Download className="w-4 h-4" />
        </a>
        <button onClick={toggleFullscreen} className="text-white">
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
