import { GraphQLServer } from "graphql-yoga";
import { join } from "path";

import config from "./config";
import resolvers from "./resolvers";
import { getUserByToken } from "./utils";
import serverHandler from "./server";
import prisma from "./config/prisma.config";
import { IContext } from "./utils/types";

const server = new GraphQLServer({
  resolverValidationOptions: { requireResolversForResolveType: false },
  typeDefs: join(__dirname, "./schema/schema.graphql"),
  resolvers,
  context: (req): IContext => ({
    ...req,
    db: prisma,
    getUser: () => getUserByToken(req.request.headers.authorization)
  })
});

serverHandler(server.express);

server.start({ port: config.PORT }, () => {
  console.log(`[server] listening on port ${config.PORT}`);
});
