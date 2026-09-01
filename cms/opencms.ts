export const opencms = {
  projectId: process.env.NEXT_PUBLIC_OPENCMS_PROJECT_ID ?? "",
  apiUrl: process.env.OPENCMS_API_URL ?? "",
  environment: process.env.OPENCMS_ENVIRONMENT
    ?? (process.env.VERCEL_ENV === "production" ? "production" : "development"),
} as const;
