// components/course/VideoPlayer.tsx
'use client';
import React, { useRef, useState } from "react";

interface VideoPlayerProps {
  link: string; // YouTube video link
  poster?: string;
  className?: string;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/i
  );
  return match ? match[1] : null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ link, poster, className = "" }) => {
  const [playing, setPlaying] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoId = extractYouTubeId(link);

  const handlePlay = () => {
    setShowIframe(true);
    setPlaying(true);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-800 bg-black shadow-lg aspect-video w-full max-w-2xl mx-auto ${className}`}
      style={{ minHeight: 240 }}
    >
      {!showIframe && videoId && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer group" onClick={handlePlay}>
          <img
            src={
              poster ||
              `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            }
            alt="Video poster"
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
            style={{ filter: "none" }}
          />
          {/* Subtle gradient overlay for better visibility */}
          <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 via-transparent to-transparent rounded-xl" />
          <button
            className="absolute z-20 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg p-4 transition-all duration-200 border-2 border-black"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            aria-label="Play video"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#fff" fillOpacity="0.85" />
              <polygon points="20,16 36,24 20,32" fill="#000" />
            </svg>
          </button>
        </div>
      )}
      {showIframe && videoId && (
        <iframe
          ref={iframeRef}
          className="absolute inset-0 w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {/* Removed duplicate gradient overlay for clarity */}
    </div>
  );
};

export default VideoPlayer;