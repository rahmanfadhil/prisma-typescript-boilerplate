import { Prisma } from "../prisma";
import config from "./index";
const prisma = new Prisma({
  debug: config.NODE_ENV !== "production",
  endpoint: config.PRISMA_ENDPOINT
});
export default prisma;
