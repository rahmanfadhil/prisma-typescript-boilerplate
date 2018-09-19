import { GraphQLServer } from "graphql-yoga";
import { Prisma } from "./prisma";
import { join } from "path";

import config from "./config";
import resolvers from "./resolvers";
import { IContext, getUserByToken, decodeVerifyEmailToken } from "./utils";
import serverHandler from "./server";

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

serverHandler(server.express, prisma);

server.start({ port: config.PORT }, () => {
  console.log(`[server] listening on port ${config.PORT}`);
});
