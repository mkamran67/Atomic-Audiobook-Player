const COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
];

function getColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(text: string): string {
  return text
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function bookCover(title: string, w = 200, h = 300): string {
  const bg = getColor(title);
  const initials = getInitials(title);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="${bg}" rx="8"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
      fill="white" font-family="Inter,system-ui,sans-serif" font-size="${Math.round(w * 0.22)}" font-weight="600">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function avatarPlaceholder(name: string, size = 100): string {
  const bg = getColor(name);
  const initials = getInitials(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="${bg}" rx="${size / 2}"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
      fill="white" font-family="Inter,system-ui,sans-serif" font-size="${Math.round(size * 0.36)}" font-weight="600">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
