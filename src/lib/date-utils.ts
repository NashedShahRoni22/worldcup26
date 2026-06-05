import { format, isToday, isTomorrow, parseISO } from 'date-fns';

export const formatKickoffDate = (utcDateString: string) => {
  const date = parseISO(utcDateString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
};

export const formatKickoffTime = (utcDateString: string) => {
  const date = parseISO(utcDateString);
  return format(date, 'HH:mm');
};
