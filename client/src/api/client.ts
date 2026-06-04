import axios from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const assetUrl = (path?: string) => !path ? "" : path.startsWith("http") ? path : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${path}`;

export const fallbackImageUrl = (label = "Image unavailable") => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="650" viewBox="0 0 900 650"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#eef2ff"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient></defs><rect width="900" height="650" fill="url(#g)"/><rect x="280" y="205" width="340" height="210" rx="28" fill="#ffffff" opacity=".72"/><path d="M346 372l78-84 55 58 35-37 88 94H346z" fill="#94a3b8"/><circle cx="562" cy="266" r="28" fill="#38bdf8"/><text x="450" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#334155">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
