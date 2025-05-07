const approvalModal = async ({ ack, body, view, client, logger }) => {
  await ack();

  const requester = body.user.id;
  const selectedUser =
    view.state.values.user_section.selected_user.selected_user;
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
            text: `*New Approval Request from <@${requester}>*\n>${requestText}`,
          },
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
                emoji: true,
              },
              style: "primary",
              value: JSON.stringify({ requester, requestText }),
              action_id: "review_request",
            },
          ],
        },
      ],
    });
  } catch (error) {
    logger.error(error);
  }
};

const approvalResponseModal = async ({ ack, body, view, client, logger }) => {
  await ack();

  try {
    const { requester, requestText } = JSON.parse(view.private_metadata);
    const approver = body.user.id;
    const decision =
      view.state.values.approval_decision.decision_select.selected_option.value;
    const comment =
      view.state.values.approval_comment.comment_input.value ||
      "No comment provided";

    // Open a DM channel with the requester
    const dmChannel = await client.conversations.open({
      users: requester,
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
            text: `*Request Update*\nYour request has been *${decision}* by <@${approver}>`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Original Request:*\n>${requestText}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Comment from <@${approver}>:*\n>${comment}`,
          },
        },
      ],
    });
  } catch (error) {
    logger.error(error);
  }
};

export { approvalModal, approvalResponseModal };
