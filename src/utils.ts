/**
 * Remaining whole seconds until a wall-clock anchor timestamp. Never negative.
 * The optional `nowMs` parameter exists so tests can use deterministic clocks.
 */
export const remainingSeconds = (endTimeMs: number, nowMs: number = Date.now()): number => {
    return Math.max(0, Math.ceil((endTimeMs - nowMs) / 1000));
};

export const toTotalSeconds = (minutes: number, seconds: number): number => {
    return minutes * 60 + seconds;
};

/** Format a total-seconds count as mm:ss. */
export const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/** Format minute/second parts as mm:ss. */
export const formatTimeFromParts = (minutes: number, seconds: number): string => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const parseTimeInput = (input: string): { minutes: number; seconds: number } => {
    if (input.includes(':')) {
        const [minStr, secStr] = input.split(':');
        const minutes = parseInt(minStr, 10);
        const seconds = parseInt(secStr, 10);
        if (
            isNaN(minutes) ||
            isNaN(seconds) ||
            minutes < 0 ||
            seconds < 0 ||
            seconds > 59
        ) {
            throw new Error('Invalid time format. Use mm:ss with seconds 0-59.');
        }
        return { minutes, seconds };
    }
    const totalSeconds = parseInt(input, 10);
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        throw new Error('Invalid time format. Must be a non-negative number or mm:ss.');
    }
    return { minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 };
};

export const validateNumeric = (
    value: string,
    fieldName: string,
    options: { isInteger?: boolean; min?: number; max?: number } = {},
): number => {
    const num = Number(value);
    if (isNaN(num)) {
        throw new Error(`${fieldName} must be a number.`);
    }
    if (options.isInteger && !Number.isInteger(num)) {
        throw new Error(`${fieldName} must be a whole number.`);
    }
    if (options.min !== undefined && num < options.min) {
        throw new Error(`${fieldName} must be at least ${options.min}.`);
    }
    if (options.max !== undefined && num > options.max) {
        throw new Error(`${fieldName} must be no more than ${options.max}.`);
    }
    return num;
};
