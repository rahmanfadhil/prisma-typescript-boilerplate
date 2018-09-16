import * as dotenv from "dotenv";

interface IConfig {
  NODE_ENV: "production" | "development";
  PORT: number;
  JWT_SECRET: string;

  PRISMA_ENDPOINT: string;
  PRISMA_MANAGEMENT_API_SECRET: string;
}

const config: IConfig = dotenv.config().parsed as any;

export default config;
