import { ContextParameters } from "graphql-yoga/dist/types";
import { Prisma } from "./generated/prisma";

export interface IContext extends ContextParameters {
  db: Prisma;
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
