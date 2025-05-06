import "dotenv/config";
import pkg from "@slack/bolt";
const { App } = pkg;

const app = new App({
  token: process.env.Bot_User_OAuth_Token,
  signingSecret: process.env.Signing_Secret,
  appToken: process.env.Slack_App_Verification_Token,
  socketMode: true,
});

app.command("/say_name", async ({ command, ack, say }) => {
  await ack();
  await say(`Hello mdck,<@${command.user_id}>`);
});

// Listens to incoming messages that contain "hello"
app.command("/approval-test", async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        title: {
          type: "plain_text",
          text: "Approve-iT",
          emoji: true,
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true,
        },
        type: "modal",
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: ":wave: Hey david! Create a new request for:",
              emoji: true,
            },
            accessory: {
              type: "users_select",
              placeholder: {
                type: "plain_text",
                text: "select a user",
                emoji: true,
              },
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            label: {
              type: "plain_text",
              text: "Write about your request in detail?",
              emoji: true,
            },
            element: {
              type: "plain_text_input",
              multiline: true,
            },
          },
        ],
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
  } catch (error) {
    console.error("Error starting app:", error);
  }
})();
