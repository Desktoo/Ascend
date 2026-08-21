import { NotificationPayload, TemplateContext } from '../notification.types';

type TemplateGenerator = (context?: TemplateContext) => NotificationPayload;

export const NotificationTemplates: Record<string, TemplateGenerator> = {
  // -- PROGRESS CATEGORY --
  RANK_UP: (ctx) => ({
    type: 'PROGRESS',
    title: 'Rank Up!',
    body: `Incredible! You have reached ${ctx?.rank || 'a new rank'}.`,
    data: { rank: ctx?.rank as string },
  }),

  // -- REMINDER CATEGORY --
  REMINDER_START_DAY: () => ({
    type: 'REMINDER',
    title: 'Good Morning!',
    body: 'Your day is starting. Time to tackle your goals.',
  }),
  REMINDER_MID_DAY: () => ({
    type: 'REMINDER',
    title: 'Mid-Day Check',
    body: 'Halfway there! Keep your momentum going.',
  }),
  REMINDER_END_DAY: () => ({
    type: 'REMINDER',
    title: 'Day Complete',
    body: 'Time to wind down and reflect on your progress.',
  }),

  // Add as many as you want here in the future without touching the Service!
};
