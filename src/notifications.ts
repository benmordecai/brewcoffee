import { LocalNotifications } from '@capacitor/local-notifications';

export const playNotificationSound = async (currentPour: number, totalPours: number) => {
    console.log("Attempting to schedule notification...");
    try {
        const result = await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Brew Coffee',
                    body: totalPours > 1 ? `Pour ${currentPour} of ${totalPours} complete` : 'Brewing Complete',
                    id: 1, // Unique ID for this notification
                    channelId: 'timer_completion',
                    sound: 'default',
                    smallIcon: 'res://ic_notification',
                    
                },
            ],
        });
        console.log("Notification scheduled result:", result);
    } catch (e) {
        console.error("Error scheduling notification:", e);
    }
};
