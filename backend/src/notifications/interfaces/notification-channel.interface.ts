export interface DailyReminderPayload {
  userName: string;
  totalCards: number;
  subjectSummary: { subjectName: string; count: number }[];
}

export interface NotificationChannel {
  sendDailyReminder(
    recipient: string,
    payload: DailyReminderPayload,
  ): Promise<void>;
}
