import { forwardTo } from "prisma-binding";
import { IResolversMap } from "../utils";
import { hash, compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import config from "../config";

const resolvers: IResolversMap = {
  Query: {
    users: forwardTo("db"),
    user: forwardTo("db")
  },
  Mutation: {
    login: async (_, args, ctx) => {
      const user = await ctx.db.query.user({ where: { email: args.email } });
      const valid = await compare(args.password, user.password);
      if (!valid) throw new Error("Password invalid!");
      const token = jwt.sign({ id: user.id }, config.JWT_SECRET);
      return { token, user };
    },
    register: async (_, args, ctx) => {
      const { email, name } = args;
      const password = await hash(args.password, 10);
      const user = await ctx.db.mutation.createUser({
        data: { name, email, password }
      });
      const token = jwt.sign({ id: user.id }, config.JWT_SECRET);
      return { token, user };
    }
  }
};

export default resolvers;
