import * as nodemailer from "nodemailer";
import config from "./index";

const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.SENDER_EMAIL,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    accessToken: config.GOOGLE_OAUTH_ACCESS_TOKEN,
    refreshToken: config.GOOGLE_OAUTH_REFRESH_TOKEN
  }
});

export default mail;

export const sendEmail = async ({ subject, to, content }) => {
  await mail.sendMail(
    {
      from: config.SENDER_EMAIL,
      to,
      subject,
      html: content,
      text: content
    },
    (err, info) => console.log(info)
  );
};
