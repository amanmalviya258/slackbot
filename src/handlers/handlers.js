const sayName = async ({ command, ack, say }) => {
  await ack();
  await say(`Hello,<@${command.user_id}>`);
};
const approvalTest = async ({ ack, body, client, logger }) => {
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
        text: "Sorry, there was an error processing your request. Please try again.",
      });
    } catch (ephemeralError) {
      logger.error(ephemeralError);
    }
  }
};

export { sayName, approvalTest };
