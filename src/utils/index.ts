import * as jwt from "jsonwebtoken";

import { User } from "../prisma";
import prisma from "../config/prisma.config";
import config from "../config";

export function generateToken(id) {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: "7d" });
}

export async function getUserByToken(token: string): Promise<User> {
  if (token) {
    try {
      const { id }: any = jwt.verify(token, config.JWT_SECRET);
      const user = await prisma.query.user({ where: { id } });
      if (!user) throw new Error("Token invalid!");
      return user;
    } catch (err) {
      throw new Error("Token invalid!");
    }
  } else {
    return;
  }
}

export async function decodeVerifyEmailToken(token: string): Promise<User> {
  try {
    const { id }: any = jwt.verify(token, config.JWT_SECRET);
    const user = await prisma.query.user({ where: { id } });
    if (!user) throw new Error("Token invalid!");
    await prisma.mutation.updateUser({
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
