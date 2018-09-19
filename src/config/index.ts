import * as dotenv from "dotenv";

interface IConfig {
  NODE_ENV: "production" | "development";
  PORT: number;
  JWT_SECRET: string;
  BASE_URL: string;

  PRISMA_ENDPOINT: string;

  SENDER_EMAIL: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;

  GOOGLE_OAUTH_REFRESH_TOKEN: string;
  GOOGLE_OAUTH_ACCESS_TOKEN: string;
}

const config: IConfig = dotenv.config().parsed as any;

export default config;
