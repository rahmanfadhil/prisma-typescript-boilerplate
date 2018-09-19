import * as dotenv from "dotenv";

interface IConfig {
  NODE_ENV: "production" | "development";
  PORT: number;
  JWT_SECRET: string;
  BASE_URL: string;

  PRISMA_ENDPOINT: string;

  SENDGRID_KEY: string;
  SENDGRID_EMAIL: string;
}

const config: IConfig = dotenv.config().parsed as any;

export default config;
