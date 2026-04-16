const normalize = (value: string) => value.trim().replace(/\/$/, "");

export const getApiBaseUrl = (): string => {
  const explicitBase = import.meta.env.VITE_API_BASE_URL;

  if (explicitBase) {
    return normalize(explicitBase);
  }

  if (import.meta.env.DEV) {
    // In local development, keep using Vite proxy (/api -> localhost:8080).
    return "";
  }

  // In production, no Vite proxy exists. Empty base keeps same-origin calls
  // so Option B (Vercel /api serverless routes) continues to work.
  return "";
};

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
