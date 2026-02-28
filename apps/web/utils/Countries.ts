let cached: { value: string; label: string }[] | null = null;

export const getCountryOptions = async () => {
  if (cached) return cached;

  const countries = await import('world-countries').then((m) =>
    m.default
      .map((c) => ({ value: c.cca2, label: c.name.common }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  cached = countries;
  return cached;
};
