import { useCallback, useRef, useState } from 'react';
import { HistoryEntry } from '../types';

const MAX_HISTORY = 40;

export function useHistory(initial: HistoryEntry) {
  const [past, setPast] = useState<HistoryEntry[]>([]);
  const [present, setPresent] = useState<HistoryEntry>(initial);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  const isSliding = useRef(false);

  const push = useCallback((entry: HistoryEntry) => {
    if (isSliding.current) return;
    setPast((p) => {
      const next = [...p, present];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setPresent(entry);
    setFuture([]);
  }, [present]);

  const replacePresent = useCallback((entry: HistoryEntry) => {
    setPresent(entry);
  }, []);

  const startSliding = useCallback(() => {
    isSliding.current = true;
  }, []);

  const endSliding = useCallback((entry: HistoryEntry) => {
    isSliding.current = false;
    setPast((p) => {
      const next = [...p, present];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setPresent(entry);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [present, ...f]);
    setPresent(previous);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present]);
    setPresent(next);
  }, [future, present]);

  return {
    present,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    push,
    replacePresent,
    startSliding,
    endSliding,
    undo,
    redo,
  };
}