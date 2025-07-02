import { LocalNotifications } from '@capacitor/local-notifications';

export const playNotificationSound = async () => {
    console.log("Attempting to schedule notification...");
    try {
        const result = await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Timer Completed!',
                    body: 'Your timer has finished.',
                    id: 1, // Unique ID for this notification
                    channelId: 'timer_completion',
                    sound: 'default',
                    
                },
            ],
        });
        console.log("Notification scheduled result:", result);
    } catch (e) {
        console.error("Error scheduling notification:", e);
    }
};
