export const notify = (
  title: string,
  type: 'success' | 'error' | 'info',
  description?: string,
) => {
  const event = new CustomEvent('app:toast', {
    detail: { title, type, description },
  });
  window.dispatchEvent(event);
};
