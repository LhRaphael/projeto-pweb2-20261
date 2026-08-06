import type { SpendingLimitAlert } from './spendingLimitAlerts';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function showSpendingLimitNotification(alert: SpendingLimitAlert | null): Promise<void> {
  if (!alert) {
    return;
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  const isAllowed = Notification.permission === 'granted' || (await requestNotificationPermission());

  if (!isAllowed) {
    return;
  }

  new Notification('Limite de gastos', {
    body: alert.message,
    icon: '/favicon.svg',
  });
}