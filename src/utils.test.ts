import { describe, expect, it } from 'vitest';
import {
    formatTime,
    formatTimeFromParts,
    parseTimeInput,
    remainingSeconds,
    toTotalSeconds,
    validateNumeric,
} from './utils';

describe('parseTimeInput', () => {
    it('parses mm:ss input', () => {
        expect(parseTimeInput('01:30')).toEqual({ minutes: 1, seconds: 30 });
    });

    it('parses plain seconds into minutes and seconds', () => {
        expect(parseTimeInput('90')).toEqual({ minutes: 1, seconds: 30 });
    });

    it('accepts zero', () => {
        expect(parseTimeInput('0:00')).toEqual({ minutes: 0, seconds: 0 });
        expect(parseTimeInput('0')).toEqual({ minutes: 0, seconds: 0 });
    });

    it('rejects seconds above 59 in mm:ss form', () => {
        expect(() => parseTimeInput('1:60')).toThrow();
    });

    it('rejects negative values', () => {
        expect(() => parseTimeInput('-5')).toThrow();
        expect(() => parseTimeInput('-1:30')).toThrow();
    });

    it('rejects non-numeric input', () => {
        expect(() => parseTimeInput('abc')).toThrow();
    });
});

describe('validateNumeric', () => {
    it('returns the parsed number', () => {
        expect(validateNumeric('15', 'Ratio')).toBe(15);
        expect(validateNumeric('2.5', 'Ratio')).toBe(2.5);
    });

    it('rejects non-numeric input with the field name', () => {
        expect(() => validateNumeric('abc', 'Ratio')).toThrow('Ratio must be a number.');
    });

    it('enforces integers when requested', () => {
        expect(() => validateNumeric('3.5', 'Pours', { isInteger: true })).toThrow();
        expect(validateNumeric('3', 'Pours', { isInteger: true })).toBe(3);
    });

    it('enforces min and max bounds', () => {
        expect(() => validateNumeric('0', 'Pours', { min: 1, max: 10 })).toThrow();
        expect(() => validateNumeric('11', 'Pours', { min: 1, max: 10 })).toThrow();
        expect(validateNumeric('3', 'Pours', { isInteger: true, min: 1, max: 10 })).toBe(3);
    });
});

describe('time formatting', () => {
    it('formats total seconds as mm:ss', () => {
        expect(formatTime(90)).toBe('01:30');
        expect(formatTime(0)).toBe('00:00');
        expect(formatTime(600)).toBe('10:00');
    });

    it('formats minute/second parts as mm:ss', () => {
        expect(formatTimeFromParts(1, 5)).toBe('01:05');
        expect(formatTimeFromParts(0, 30)).toBe('00:30');
    });
});

describe('timer math', () => {
    it('converts minutes and seconds to total seconds', () => {
        expect(toTotalSeconds(1, 30)).toBe(90);
        expect(toTotalSeconds(10, 0)).toBe(600);
    });

    it('computes remaining whole seconds from a wall-clock anchor', () => {
        const now = 1_000_000;
        expect(remainingSeconds(now + 90_000, now)).toBe(90);
        expect(remainingSeconds(now + 500, now)).toBe(1);
        expect(remainingSeconds(now, now)).toBe(0);
    });

    it('never returns negative remaining time', () => {
        const now = 1_000_000;
        expect(remainingSeconds(now - 5_000, now)).toBe(0);
    });
});
