const AUTH_CHANNEL = 'impact-auth-events';

export function broadcastLogout(): void {
  if (!('BroadcastChannel' in window)) return;
  const channel = new BroadcastChannel(AUTH_CHANNEL);
  channel.postMessage({ type: 'logout' });
  channel.close();
}

export function subscribeToLogout(onLogout: () => void): () => void {
  if (!('BroadcastChannel' in window)) return () => undefined;
  const channel = new BroadcastChannel(AUTH_CHANNEL);
  channel.onmessage = (event: MessageEvent<unknown>) => {
    if (typeof event.data === 'object' && event.data !== null && 'type' in event.data && event.data.type === 'logout') onLogout();
  };
  return () => channel.close();
}
