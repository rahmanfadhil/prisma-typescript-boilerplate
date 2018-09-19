import { GraphQLServer } from "graphql-yoga";
import { Prisma } from "./prisma";
import { join } from "path";

import config from "./config";
import resolvers from "./resolvers";
import { IContext, getUserByToken, decodeVerifyEmailToken } from "./utils";

const prisma = new Prisma({
  debug: config.NODE_ENV !== "production",
  endpoint: config.PRISMA_ENDPOINT
});

const server = new GraphQLServer({
  resolverValidationOptions: { requireResolversForResolveType: false },
  typeDefs: join(__dirname, "./schema/schema.graphql"),
  resolvers,
  context: (req): IContext => ({
    ...req,
    db: prisma,
    getUser: () => getUserByToken(prisma, req.request.headers.authorization)
  })
});

server.express.get("/verify_account", async (req, res) => {
  if (!req.query.token)
    return res.send({ error: true, message: "Token not found!" });
  try {
    const data = await decodeVerifyEmailToken(prisma, req.query.token);
    res.send({ error: false, message: `${data.email} is verified!` });
  } catch (err) {
    res.send({ error: true, message: err });
  }
});

server.start({ port: config.PORT }, () => {
  console.log(`[server] listening on port ${config.PORT}`);
});
