const trail = {
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
        text: ":wave: Hey david!\n\nCreate a new request:",
        emoji: true,
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Choose list",
          emoji: true,
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "My events",
              emoji: true,
            },
            value: "value-0",
          },
          {
            text: {
              type: "plain_text",
              text: "All events",
              emoji: true,
            },
            value: "value-1",
          },
          {
            text: {
              type: "plain_text",
              text: "Event invites",
              emoji: true,
            },
            value: "value-1",
          },
        ],
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
};
