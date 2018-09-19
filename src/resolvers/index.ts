import { IResolversMap } from "../utils/types";
import userController from "./user.resolver";

const resolvers: IResolversMap = {
  Query: {
    ...userController.Query
  },
  Mutation: {
    ...userController.Mutation
  }
};

export default resolvers;
