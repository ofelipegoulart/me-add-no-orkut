"use client";

import { useState, useCallback } from "react";

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(objA[key], objB[key]));
  }
  return false;
}

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function useTabForm<T extends Record<string, unknown>>(initialData: T) {
  const [snapshot, setSnapshot] = useState<T>(() => clone(initialData));
  const [current, setCurrent] = useState<T>(() => clone(initialData));

  const update = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      setCurrent((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  function getDirtyPayload(): Partial<T> {
    const payload: Partial<T> = {};
    for (const key in current) {
      if (!deepEqual(current[key], snapshot[key])) {
        payload[key] = current[key];
      }
    }
    return payload;
  }

  function cancel() {
    setCurrent(clone(snapshot));
  }

  function commit() {
    setSnapshot(clone(current));
  }

  function reset(newData: T) {
    const cloned = clone(newData);
    setSnapshot(cloned);
    setCurrent(clone(newData));
  }

  return { data: current, update, getDirtyPayload, cancel, commit, reset };
}
