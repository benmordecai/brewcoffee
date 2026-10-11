import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const TIMER_CHANNEL_ID = 'timer_completion';

let channelReady = false;

/**
 * Create the Android notification channel for timer completion (and request
 * notification permission). Idempotent; safe to call on web, where it no-ops.
 */
export const ensureNotificationChannel = async (): Promise<void> => {
    if (!Capacitor.isNativePlatform() || channelReady) {
        return;
    }
    try {
        await LocalNotifications.requestPermissions();
        await LocalNotifications.createChannel({
            id: TIMER_CHANNEL_ID,
            name: 'Timer completion',
            description: 'Alerts when a brew timer finishes',
            importance: 4,
            sound: 'default',
            vibration: true,
        });
        channelReady = true;
    } catch (e) {
        console.error('Error creating notification channel:', e);
    }
};

/** Web Audio fallback: three short beeps, for browsers without notifications. */
const playWebBeep = (): void => {
    try {
        const AudioCtor =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtor();
        [0, 0.35, 0.7].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            const t = ctx.currentTime + delay;
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(0.5, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.32);
        });
    } catch (e) {
        console.error('Error playing web beep:', e);
    }
};

/** Browser Notification API fallback. */
const showWebNotification = (title: string, body: string): void => {
    try {
        if (!('Notification' in window)) {
            return;
        }
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
            void Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    } catch (e) {
        console.error('Error showing web notification:', e);
    }
};

/**
 * Alert the user that a pour timer finished. Uses Capacitor local notifications
 * on native; on web falls back to the Notification API plus a Web Audio beep
 * (the old code only wrote to the console there).
 */
export const notifyTimerComplete = async (currentPour: number, totalPours: number): Promise<void> => {
    const title = 'Brew Coffee';
    const body = totalPours > 1 ? `Pour ${currentPour} of ${totalPours} complete` : 'Brewing Complete';
    if (Capacitor.isNativePlatform()) {
        await ensureNotificationChannel();
        try {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title,
                        body,
                        id: 1,
                        channelId: TIMER_CHANNEL_ID,
                        sound: 'default',
                        smallIcon: 'res://ic_stat_notification',
                    },
                ],
            });
        } catch (e) {
            console.error('Error scheduling notification:', e);
        }
        return;
    }
    showWebNotification(title, body);
    playWebBeep();
};
