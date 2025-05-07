# Slackbot - Approval and Request Management System

A Slack bot application built with Node.js and the Slack Bolt framework that facilitates approval workflows and request management within Slack workspaces.

## Features

- **Command-based Interactions**
  - `/say_name` - Basic command to test bot functionality
  - `/approval-test` - Initiates the approval workflow

- **Approval Workflow**
  - Request submission through modal interfaces in channels chat or the bot's DM.
  - Approval and denial action for the approval appears in Bot's DM.
  - Request review functionality,Decision will be sent to the requester in the Bot's DM

## Prerequisites

- Node.js (Latest LTS version recommended)
- A Slack workspace with admin privileges
- Slack App credentials (Bot User OAuth Token, Signing Secret, and App Verification Token)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd slackbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   Bot_User_OAuth_Token=your-bot-token
   Signing_Secret=your-signing-secret
   Slack_App_Verification_Token=your-app-token
   PORT=3000
   ```

## Project Structure

```
slackbot/
├── src/
│   ├── actions/     # Action handlers for interactive components
│   ├── handlers/    # Command and event handlers
│   ├── views/       # Modal and view templates
│   └── index.js     # Main application entry point
├── public/          # Static assets
└── package.json     # Project dependencies and scripts
```

## File Interactions and Workflow

### Core Components

1. **Entry Point (`src/index.js`)**
   - Initializes the Slack Bolt app
   - Sets up environment variables
   - Registers command handlers and action listeners
   - Configures the server to run on specified port

2. **Handlers (`src/handlers/`)**
   - `handlers.js`: Contains command handlers for:
     - `/say_name`: Basic bot interaction test
     - `/approval-test`: Initiates the approval workflow

3. **Actions (`src/actions/`)**
   - `actions.js`: Manages interactive components:
     - `approveRequest`: Handles approval actions
     - `denyRequest`: Handles denial actions
     - `reviewRequest`: Manages request review process
     - `testButton`: Handles test button interactions

4. **Views (`src/views/`)**
   - `modals.js`: Contains modal templates for:
     - `approvalModal`: Initial request submission form
     - `approvalResponseModal`: Response interface for approvers

### Workflow Process

1. **Request Initiation**
   - User triggers `/approval-test` command in any channel or DM
   - Bot opens `approvalModal` for request submission
   - User fills out and submits the request form

2. **Approval Process**
   - Bot sends approval request to designated approvers via DM
   - Approvers receive interactive buttons for approve/deny actions
   - Bot processes the decision through `approveRequest` or `denyRequest` handlers

3. **Response Handling**
   - Bot notifies the requester of the decision via DM
   - All interactions are logged and tracked
   - Request status is updated in the system

### Communication Flow

```
User (Requester) → Bot → Approver → Bot → User (Requester)
     ↓              ↓        ↓        ↓        ↓
  Command      Modal View  Action   Response  Update
  Trigger      Display    Handler   Process   Status
```

## Development

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

## Production

To start the application in production mode:

```bash
npm start
```

## Dependencies

- `@slack/bolt`: Slack's official framework for building Slack apps
- `express`: Web framework for Node.js
- `dotenv`: Environment variable management
- `nodemon`: Development server with auto-reload
- `prettier`: Code formatting


## More details of the architectural structure/Sequence workflow are available on eraser.io
**Link=>** https://app.eraser.io/workspace/xA5tn7SAtUrmeR7QuPxJ?origin=share

##Video Demonstration
**=>** https://www.youtube.com/watch?v=NPaMjIcXqjI
