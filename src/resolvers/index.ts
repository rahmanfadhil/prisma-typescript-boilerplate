import { forwardTo } from "prisma-binding";

const resolvers = {
  Query: {
    users: forwardTo("db")
  }
};

export default resolvers;
