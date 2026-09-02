import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  mongodbUri: string;
  nodeEnv: "development" | "production" | "test";
  clientUrl: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  port: parseInt(getEnvVar("PORT", "5000"), 10),
  mongodbUri: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/fullstack_app"),
  nodeEnv: getEnvVar("NODE_ENV", "development") as EnvConfig["nodeEnv"],
  clientUrl: getEnvVar("CLIENT_URL", "http://localhost:5173"),
};
