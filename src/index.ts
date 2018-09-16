import { GraphQLServer } from "graphql-yoga";
import { Prisma } from "./generated/prisma";

import config from "./config";
import resolvers from "./resolvers";
import { IContext } from "./utils";

const server = new GraphQLServer({
  resolverValidationOptions: { requireResolversForResolveType: false },
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: (req): IContext => ({
    ...req,
    db: new Prisma({
      debug: config.NODE_ENV !== "production",
      endpoint: config.PRISMA_ENDPOINT,
      secret: config.PRISMA_MANAGEMENT_API_SECRET
    })
  })
});

server.start({ port: config.PORT }, () => {
  console.log(`[server] listening on port ${config.PORT}`);
});
