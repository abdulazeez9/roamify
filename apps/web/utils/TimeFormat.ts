export const formatTime = (
  date: string | Date | null | undefined,
  showTimeZone: boolean = false,
) => {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Time';

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(showTimeZone && { timeZoneName: 'short' }),
  });
};
