const testButton = async ({ ack, body, client }) => {
  await ack();
  await client.chat.postMessage({
    channel: body.channel.id,
    text: "Test button clicked!",
  });
};
const approveRequest = async ({ ack, body, client, action }) => {
  console.log("Approve button clicked");
  await ack();

  try {
    const { requester, decision } = JSON.parse(action.value);
    console.log("Requester:", requester);

    // Send message to the channel where button was clicked
    await client.chat.postMessage({
      channel: body.channel.id,
      text: `Approval test message in channel`,
    });

    // Try to send DM
    const dmChannel = await client.conversations.open({
      users: requester,
    });

    await client.chat.postMessage({
      channel: dmChannel.channel.id,
      text: "Test DM message",
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
const denyRequest = async ({ ack, body, client, action }) => {
  console.log("Deny button clicked");
  await ack();

  try {
    const { requester, decision } = JSON.parse(action.value);
    console.log("Requester:", requester);

    // Send message to the channel where button was clicked
    await client.chat.postMessage({
      channel: body.channel.id,
      text: `Denial test message in channel`,
    });

    // Try to send DM
    const dmChannel = await client.conversations.open({
      users: requester,
    });

    await client.chat.postMessage({
      channel: dmChannel.channel.id,
      text: "Test DM message",
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
const reviewRequest = async ({ ack, body, client, action }) => {
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
          emoji: true,
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Request from <@${requester}>*\n>${requestText}`,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "approval_decision",
            label: {
              type: "plain_text",
              text: "Your Decision",
              emoji: true,
            },
            element: {
              type: "static_select",
              action_id: "decision_select",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Approve",
                    emoji: true,
                  },
                  value: "approved",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Deny",
                    emoji: true,
                  },
                  value: "denied",
                },
              ],
            },
          },
          {
            type: "input",
            block_id: "approval_comment",
            label: {
              type: "plain_text",
              text: "Add a comment (optional)",
              emoji: true,
            },
            element: {
              type: "plain_text_input",
              action_id: "comment_input",
              multiline: true,
              placeholder: {
                type: "plain_text",
                text: "Add any additional comments about your decision...",
              },
            },
            optional: true,
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export { testButton, approveRequest, denyRequest, reviewRequest };
