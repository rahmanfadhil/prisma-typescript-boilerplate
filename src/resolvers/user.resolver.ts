import { compare, hash } from "bcrypt";
import { forwardTo } from "prisma-binding";

import { IResolversMap } from "../utils/types";
import { generateToken, getUserByToken } from "../utils";
import mail, { sendEmail } from "../config/mail.config";
import config from "../config";
import redis from "../config/redis.config";

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
      const token = generateToken(user.id);
      const verifyURL = `${config.BASE_URL}/verify_account?token=${token}`;
      await sendEmail({
        to: email,
        subject: "Confirm your account",
        content: `
          <h1>Please confirm your account<h1>
          <a href="${verifyURL}">${verifyURL}</a>
        `
      });
      return { token, user };
    },
    forgotPassword: async (_, { email }, ctx) => {
      const user = await ctx.db.query.user({ where: { email } });
      if (!user) throw new Error("User not found!");
      const token = generateToken(user.id);
      await redis.set(`reset_password:${user.email}`, token);
      await redis.expire(`reset_password:${user.email}`, 43200);
      const verifyURL = `${config.BASE_URL}/forgot_password?token=${token}`;
      await sendEmail({
        to: email,
        subject: "Forgot password",
        content: `
          <h1>Please click this link toreset your password<h1>
          <a href="${verifyURL}">${verifyURL}</a>
        `
      });
      return true;
    },
    resetPassword: async (_, { token, new_password }, ctx) => {
      const user = await getUserByToken(token);
      if (!user) throw new Error("User not found!");
      const data = await redis.get(`reset_password:${user.email}`);
      if (!data) throw new Error("Token not valid!");
      const password = await hash(new_password, 10);
      await ctx.db.mutation.updateUser({
        where: { id: user.id },
        data: { password }
      });
      await redis.del(`reset_password:${user.email}`);
      return true;
    }
  }
};

export default userController;
