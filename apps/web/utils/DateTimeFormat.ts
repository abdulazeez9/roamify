export const formatDateTimeWithZone = (
  dateTime: string | Date | null | undefined,
) => {
  if (!dateTime) return 'N/A';

  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

  if (isNaN(dateObj.getTime())) return 'Invalid DateTime';

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
};
