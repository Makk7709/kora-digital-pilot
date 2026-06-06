import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { KeyboardEvent } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Rend un élément non-natif (div/Card/Badge avec `role="button"`) activable
 * au clavier : déclenche `onActivate` sur Entrée ou Espace, en accord avec
 * le pattern WAI-ARIA "button". À utiliser avec `role="button"` + `tabIndex={0}`.
 */
export function handleActivateKey<T extends Element>(
  onActivate: () => void,
): (event: KeyboardEvent<T>) => void {
  return (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  };
}
