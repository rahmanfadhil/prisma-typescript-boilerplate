import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../config";
import { IResolversMap } from "../utils";
import { forwardTo } from "prisma-binding";
import { generateToken } from "../utils";

const userController: IResolversMap = {
  Query: {
    // Generated
    users: forwardTo("db"),
    user: forwardTo("db"),

    // Custom
    me: async (_, args, ctx) => {
      const user = ctx.getUser();
      if (!user) throw new Error("Token not found!");
      return user;
    }
  },
  Mutation: {
    // Generated
    updateUser: forwardTo("db"),
    deleteUser: forwardTo("db"),
    updateManyUsers: forwardTo("db"),
    deleteManyUsers: forwardTo("db"),

    // Custom
    login: async (_, args, ctx) => {
      const user = await ctx.db.query.user({ where: { email: args.email } });
      const valid = await compare(args.password, user.password);
      if (!valid) throw new Error("Password invalid!");
      return { token: generateToken(user.id), user };
    },
    register: async (_, args, ctx) => {
      const { email, name } = args;
      const password = await hash(args.password, 10);
      const user = await ctx.db.mutation.createUser({
        data: { name, email, password }
      });
      return { token: generateToken(user.id), user };
    }
  }
};

export default userController;
