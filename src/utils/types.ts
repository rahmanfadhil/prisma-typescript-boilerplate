import { ContextParameters } from "graphql-yoga/dist/types";
import { Prisma, User } from "../prisma";

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
