import "dotenv/config";
import pkg from "@slack/bolt";
import { approvalTest, sayName } from "./handlers/handlers.js";
import { approvalModal, approvalResponseModal } from "./views/modals.js";
import { approveRequest, denyRequest, reviewRequest, testButton } from "./actions/actions.js";
const { App } = pkg;

console.log("ENV: ", process.env.PORT);

const app = new App({
  token: process.env.Bot_User_OAuth_Token,
  signingSecret: process.env.Signing_Secret,
  appToken: process.env.Slack_App_Verification_Token,
  socketMode: true,
});

app.command("/say_name", sayName);

app.command("/approval-test", approvalTest);

app.view("approval_modal", approvalModal);

app.view("approval_response_modal", approvalResponseModal);

app.action("test_button", testButton);

app.action("approve_request", approveRequest);

app.action("deny_request", denyRequest);

// Add a new action handler for the review button
app.action("review_request", reviewRequest);

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
  } catch (error) {
    console.error("Error starting app:", error);
  }
})();
