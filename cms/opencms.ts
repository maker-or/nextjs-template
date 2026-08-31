export const opencms = {
  projectId: process.env.NEXT_PUBLIC_OPENCMS_PROJECT_ID ?? "",
  apiUrl: process.env.OPENCMS_API_URL ?? "http://localhost:3000",
  environment: process.env.OPENCMS_ENVIRONMENT ?? "development",
} as const;
