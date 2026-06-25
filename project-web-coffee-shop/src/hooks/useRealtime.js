import { useEffect, useRef } from "react";

let eventSource = null;
const listeners = new Map();

function getEventSource() {
  if (!eventSource) {
    eventSource = new EventSource("http://localhost:5000/api/sse");
  }
  return eventSource;
}

export default function useRealtime(eventName, callback) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    const es = getEventSource();

    const handler = (data) => {
      savedCallback.current(data);
    };

    if (!listeners.has(eventName)) {
      listeners.set(eventName, []);
      es.addEventListener(eventName, (e) => {
        const data = JSON.parse(e.data);
        listeners.get(eventName).forEach((cb) => cb(data));
      });
    }

    listeners.get(eventName).push(handler);

    return () => {
      const arr = listeners.get(eventName) || [];
      const idx = arr.indexOf(handler);
      if (idx > -1) arr.splice(idx, 1);
    };
  }, [eventName]);
}
