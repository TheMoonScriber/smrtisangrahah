export const formatAadhaar = (value: string) => {
  const v = value.replace(/\D/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.slice(i, i + 4));
  }
  return parts.join(' - ');
};

export const formatMobile = (value: string) => {
  const v = value.replace(/\D/g, '').slice(0, 10);
  if (v.length > 0) {
    return `+91 - ${v}`;
  }
  return v;
};
