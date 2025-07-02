import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LocalNotifications } from '@capacitor/local-notifications';

async function createTimerChannel() {
  // Request permissions first
  const permissionStatus = await LocalNotifications.requestPermissions();
  if (permissionStatus.display === 'granted') {
    await LocalNotifications.createChannel({
      id: 'timer_completion',
      name: 'Timer Completion',
      description: 'Notifications for when a timer finishes',
      importance: 5, // High importance for sound and vibration
      sound: 'default',
    });
  } else {
    console.warn('Notification permissions not granted:', permissionStatus.display);
  }
}

createTimerChannel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
