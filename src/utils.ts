/**
 * Remaining whole seconds until a wall-clock anchor timestamp. Never negative.
 * The optional `nowMs` parameter exists so tests can use deterministic clocks.
 */
export const remainingSeconds = (endTimeMs: number, nowMs: number = Date.now()): number => {
    return Math.max(0, Math.ceil((endTimeMs - nowMs) / 1000));
};
