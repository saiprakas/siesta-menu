import { useEffect, useState } from "react";
import { Store } from "./store.js";

/* Loads cafe data once and stays subscribed to live updates,
   so any Ops-panel change re-renders the page instantly. */
export function useCafeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Store.getData().then((d) => {
      if (alive) {
        setData(d);
        setLoading(false);
      }
    });
    const unsub = Store.subscribe((d) => {
      if (alive) setData(d);
    });
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  return { data, setData, loading };
}
