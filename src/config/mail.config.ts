import * as mail from "@sendgrid/mail";
import config from "./index";
mail.setApiKey(config.SENDGRID_KEY);
export default mail;
