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
        callback_id: "approval_modal",
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: [
          {
            type: "section",
            block_id: "user_section",
            text: {
              type: "plain_text",
              text: ":wave: Create a new request for:",
              emoji: true,
            },
            accessory: {
              type: "users_select",
              action_id: "selected_user",
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
            block_id: "request_input",
            label: {
              type: "plain_text",
              text: "Write about your request in detail?",
              emoji: true,
            },
            element: {
              type: "plain_text_input",
              action_id: "request_text",
              multiline: true,
            },
          },
        ],
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
    // Try to send an error message to the user
    try {
      await client.chat.postEphemeral({
        channel: body.channel_id,
        user: body.user_id,
        text: "Sorry, there was an error processing your request. Please try again."
      });
    } catch (ephemeralError) {
      logger.error(ephemeralError);
    }
  }
});

app.view('approval_modal', async ({ ack, body, view, client, logger }) => {
  await ack();

  const requester = body.user.id;
  const selectedUser = view.state.values.user_section.selected_user.selected_user;
  const requestText = view.state.values.request_input.request_text.value;

  try {
    // Send a message to the selected user with a button to open the approval modal
    await client.chat.postMessage({
      channel: selectedUser,
      text: `You have a new approval request from <@${requester}>`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New Approval Request from <@${requester}>*\n>${requestText}`
          }
        },
        {
          type: "actions",
          block_id: "approval_actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Review Request",
                emoji: true
              },
              style: "primary",
              value: JSON.stringify({ requester, requestText }),
              action_id: "review_request"
            }
          ]
        }
      ]
    });
  } catch (error) {
    logger.error(error);
  }
});

app.view('approval_response_modal', async ({ ack, body, view, client, logger }) => {
  await ack();

  try {
    const { requester, requestText } = JSON.parse(view.private_metadata);
    const approver = body.user.id;
    const decision = view.state.values.approval_decision.decision_select.selected_option.value;
    const comment = view.state.values.approval_comment.comment_input.value || "No comment provided";

    // Open a DM channel with the requester
    const dmChannel = await client.conversations.open({
      users: requester
    });

    // Send the decision to the requester
    await client.chat.postMessage({
      channel: dmChannel.channel.id,
      text: `Your request has been ${decision}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Request Update*\nYour request has been *${decision}* by <@${approver}>`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Original Request:*\n>${requestText}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Comment from <@${approver}>:*\n>${comment}`
          }
        }
      ]
    });
  } catch (error) {
    logger.error(error);
  }
});

app.action('test_button', async ({ ack, body, client }) => {
  await ack();
  await client.chat.postMessage({
    channel: body.channel.id,
    text: "Test button clicked!"
  });
});

app.action('approve_request', async ({ ack, body, client, action }) => {
  console.log('Approve button clicked');
  await ack();
  
  try {
    const { requester, decision } = JSON.parse(action.value);
    console.log('Requester:', requester);
    
    // Send message to the channel where button was clicked
    await client.chat.postMessage({
      channel: body.channel.id,
      text: `Approval test message in channel`
    });
    
    // Try to send DM
    const dmChannel = await client.conversations.open({
      users: requester
    });
    
    await client.chat.postMessage({
      channel: dmChannel.channel.id,
      text: "Test DM message"
    });
  } catch (error) {
    console.error('Error:', error);
  }
});

app.action('deny_request', async ({ ack, body, client, action }) => {
  console.log('Deny button clicked');
  await ack();
  
  try {
    const { requester, decision } = JSON.parse(action.value);
    console.log('Requester:', requester);
    
    // Send message to the channel where button was clicked
    await client.chat.postMessage({
      channel: body.channel.id,
      text: `Denial test message in channel`
    });
    
    // Try to send DM
    const dmChannel = await client.conversations.open({
      users: requester
    });
    
    await client.chat.postMessage({
      channel: dmChannel.channel.id,
      text: "Test DM message"
    });
  } catch (error) {
    console.error('Error:', error);
  }
});

// Add a new action handler for the review button
app.action('review_request', async ({ ack, body, client, action }) => {
  await ack();

  try {
    const { requester, requestText } = JSON.parse(action.value);
    
    // Open the approval modal for the reviewer
    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "approval_response_modal",
        private_metadata: JSON.stringify({ requester, requestText }),
        title: {
          type: "plain_text",
          text: "Approval Request",
          emoji: true
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Request from <@${requester}>*\n>${requestText}`
            }
          },
          {
            type: "divider"
          },
          {
            type: "input",
            block_id: "approval_decision",
            label: {
              type: "plain_text",
              text: "Your Decision",
              emoji: true
            },
            element: {
              type: "static_select",
              action_id: "decision_select",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Approve",
                    emoji: true
                  },
                  value: "approved"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Deny",
                    emoji: true
                  },
                  value: "denied"
                }
              ]
            }
          },
          {
            type: "input",
            block_id: "approval_comment",
            label: {
              type: "plain_text",
              text: "Add a comment (optional)",
              emoji: true
            },
            element: {
              type: "plain_text_input",
              action_id: "comment_input",
              multiline: true,
              placeholder: {
                type: "plain_text",
                text: "Add any additional comments about your decision..."
              }
            },
            optional: true
          }
        ]
      }
    });
  } catch (error) {
    console.error(error);
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
