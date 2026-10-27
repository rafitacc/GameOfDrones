const prefix = 'game-of-drones.';

/** Reads a saved preference; storage can be unavailable (private mode, blocked cookies). */
export function readPreference<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const value = localStorage.getItem(prefix + key);
    return allowed.find((option) => option === value) ?? null;
  } catch {
    return null;
  }
}

export function writePreference(key: string, value: string): void {
  try {
    localStorage.setItem(prefix + key, value);
  } catch {
    // The preference only lasts for this visit when storage is unavailable.
  }
}
