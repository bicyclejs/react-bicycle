import * as React from 'react';

const INTERVAL_DURAITON_MS = 100;
let isRunning = false;
let handlers: Handler[] = [];
let handlerInterval: NodeJS.Timer | undefined;
function onInterval() {
  const now = Date.now();
  handlers.forEach(handler => {
    handler.setDuration(now - handler.startTime);
  });
}
export default function useLoadingDuration(isLoading: boolean) {
  const [duration, setDuration] = React.useState(0);
  React.useEffect(() => {
    if (isLoading) {
      if (duration !== 0) {
        setDuration(0);
      }
      const handler = new Handler(setDuration, Date.now());
      handlers.push(handler);
      if (!isRunning) {
        handlerInterval = setInterval(onInterval, INTERVAL_DURAITON_MS);
      }
      return () => {
        handlers = handlers.filter(h => h !== handler);
        if (handlers.length === 0 && handlerInterval) {
          clearInterval(handlerInterval);
          isRunning = false;
        }
      };
    } else if (duration !== 0) {
      setDuration(0);
    }
  }, [isLoading]);
  return duration;
}

class Handler {
  constructor(
    public readonly setDuration: (value: number) => void,
    public readonly startTime: number,
  ) {}
}
