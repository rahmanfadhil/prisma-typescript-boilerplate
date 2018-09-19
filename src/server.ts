import { Application } from "express";

import { decodeVerifyEmailToken } from "./utils";

const serverHandler = (app: Application) => {
  app.get("/verify_account", async (req, res) => {
    if (!req.query.token)
      return res.send({ error: true, message: "Token not found!" });
    try {
      const data = await decodeVerifyEmailToken(req.query.token);
      res.send({ error: false, message: `${data.email} is verified!` });
    } catch (err) {
      res.send({ error: true, message: err });
    }
  });
};

export default serverHandler;
