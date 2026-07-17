import { useEffect, useRef, useCallback, type RefObject } from 'react';

// ─── YouTube IFrame API Types ─────────────────────────────────────────────────

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}

interface YTPlayerOptions {
  events: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLIFrameElement, opts: YTPlayerOptions) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseYouTubePlayerOptions {
  /** Only initialise when this is true (e.g. panel is active) */
  enabled: boolean;
  isMuted: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

const YOUTUBE_API_SCRIPT_ID = 'youtube-iframe-api';
let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    const existing = document.getElementById(YOUTUBE_API_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('error', () => reject(new Error('YouTube API 載入失敗')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = YOUTUBE_API_SCRIPT_ID;
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.addEventListener('error', () => {
      script.remove();
      youtubeApiPromise = null;
      reject(new Error('YouTube API 載入失敗'));
    }, { once: true });
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

export function useYouTubePlayer(
  videoRef: RefObject<HTMLIFrameElement | null>,
  deps: unknown[],
  { enabled, isMuted, onPlayStateChange }: UseYouTubePlayerOptions,
) {
  const playerRef = useRef<YTPlayer | null>(null);

  /** (Re-)initialise the player whenever deps or enabled change */
  useEffect(() => {
    if (!enabled || !videoRef.current) return;
    let cancelled = false;

    const init = () => {
      if (cancelled || !window.YT?.Player) return;
      try {
        playerRef.current?.destroy();
        playerRef.current = null;

        if (!videoRef.current) return;

        playerRef.current = new window.YT!.Player(videoRef.current, {
          events: {
            onReady(event) {
              try {
                event.target.playVideo();
                isMuted ? event.target.mute() : event.target.unMute();
              } catch { /* noop */ }
            },
            onStateChange(event) {
              const { PLAYING, PAUSED } = window.YT!.PlayerState;
              if (event.data === PLAYING) onPlayStateChange(true);
              else if (event.data === PAUSED) onPlayStateChange(false);
            },
          },
        });
      } catch { /* The iframe may have been removed while the API was initialising. */ }
    };

    void loadYouTubeApi().then(init).catch(() => {
      if (!cancelled) onPlayStateChange(false);
    });

    return () => {
      cancelled = true;
      try { playerRef.current?.destroy(); } catch { /* noop */ }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const play = useCallback(() => {
    try { playerRef.current?.playVideo(); } catch { /* noop */ }
  }, []);

  const pause = useCallback(() => {
    try { playerRef.current?.pauseVideo(); } catch { /* noop */ }
  }, []);

  const mute = useCallback((val: boolean) => {
    try {
      val ? playerRef.current?.mute() : playerRef.current?.unMute();
    } catch { /* noop */ }
  }, []);

  return { play, pause, mute, playerRef };
}
