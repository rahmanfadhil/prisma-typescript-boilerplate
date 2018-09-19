import { ContextParameters } from "graphql-yoga/dist/types";
import * as jwt from "jsonwebtoken";

import { Prisma, User } from "../prisma";
import config from "../config";

// Interfaces
export interface IContext extends ContextParameters {
  db: Prisma;
  getUser: () => Promise<User | boolean>;
}

export interface IResolversMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: { [key: string]: any },
      context: IContext,
      info: any
    ) => Promise<any>;
  };
}

// Functions
export function generateToken(id) {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: "7d" });
}

export async function getUserByToken(
  db: Prisma,
  token
): Promise<User | boolean> {
  if (token) {
    try {
      const { id }: any = jwt.verify(token, config.JWT_SECRET);
      const user = await db.query.user({ where: { id } });
      if (!user) throw new Error("Token invalid!");
      return user;
    } catch (err) {
      throw new Error("Token invalid!");
    }
  } else {
    return false;
  }
}

export async function decodeVerifyEmailToken(db: Prisma, token): Promise<User> {
  try {
    const { id }: any = jwt.verify(token, config.JWT_SECRET);
    const user = await db.query.user({ where: { id } });
    if (!user) throw new Error("Token invalid!");
    await db.mutation.updateUser({
      where: { id },
      data: {
        email_verified: true
      }
    });
    return user;
  } catch (err) {
    throw new Error("Token invalid!");
  }
}
