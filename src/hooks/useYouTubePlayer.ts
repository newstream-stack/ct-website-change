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

export function useYouTubePlayer(
  videoRef: RefObject<HTMLIFrameElement | null>,
  deps: unknown[],
  { enabled, isMuted, onPlayStateChange }: UseYouTubePlayerOptions,
) {
  const playerRef = useRef<YTPlayer | null>(null);

  /** Load the YouTube IFrame API script once */
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.getElementsByTagName('script')[0].parentNode?.insertBefore(
      tag,
      document.getElementsByTagName('script')[0],
    );
  }, []);

  /** (Re-)initialise the player whenever deps or enabled change */
  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    const init = () => {
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
      } catch (err) {
        console.error('YT player init error:', err);
      }
    };

    if (!window.YT?.Player) {
      window.onYouTubeIframeAPIReady = init;
    } else {
      init();
    }

    return () => {
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
