export const optimizeCloudinaryImage = (url: string, size = 100) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    `/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`,
  );
};
