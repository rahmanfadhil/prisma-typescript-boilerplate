import { Application } from "express";

import { decodeVerifyEmailToken } from "./utils";
import { Prisma } from "./prisma";

const serverHandler = (app: Application, db: Prisma) => {
  app.get("/verify_account", async (req, res) => {
    if (!req.query.token)
      return res.send({ error: true, message: "Token not found!" });
    try {
      const data = await decodeVerifyEmailToken(db, req.query.token);
      res.send({ error: false, message: `${data.email} is verified!` });
    } catch (err) {
      res.send({ error: true, message: err });
    }
  });
};

export default serverHandler;
