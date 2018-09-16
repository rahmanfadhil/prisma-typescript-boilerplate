import * as dotenv from "dotenv";

interface IConfig {
  PORT: number;
  NODE_ENV: "production" | "development";

  PRISMA_ENDPOINT: string;
  PRISMA_MANAGEMENT_API_SECRET: string;
}

const config: IConfig = dotenv.config().parsed as any;

export default config;
