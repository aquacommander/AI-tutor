'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * A random seed for shuffling answer options, chosen fresh on every visit.
 *
 * Randomising directly during render would break hydration: the server and the
 * browser would produce different button orders and React would throw. So the
 * nonce starts at a fixed value — the markup still comes out shuffled, just
 * predictably — and is replaced with a random one the moment the component
 * mounts. A child never sees the deterministic order; it exists only for the
 * split second before hydration.
 *
 * `reshuffle` re-rolls it, for restarting a quiz or replaying an activity.
 */
export function useShuffleNonce(): { nonce: number; reshuffle: () => void } {
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setNonce(Math.floor(Math.random() * 1_000_000_000) + 1);
  }, []);

  const reshuffle = useCallback(() => {
    setNonce(Math.floor(Math.random() * 1_000_000_000) + 1);
  }, []);

  return { nonce, reshuffle };
}
