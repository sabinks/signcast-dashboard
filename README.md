## React Dashboard

### Description

The React-based dashboard is the web interface for managing digital signage screen list and content, device status monitoring.
It enables users to create, preview, and deploy content to connected screens.

### Features

- **Content Builder (Fabric.js)**: Drag-and-drop widgets such as text, images, slideshows, weather, and iframes.
- **Live Preview**: Allows users to preview content before publishing.
- **Device Management**: View connected screens and their statuses.
- **Socket Integration**: Real-time updates for device synchronization.

---

## Setup Instructions

### Prerequisites

- node version 22.0.0

### Command

-npm install

### Environment Variables

Create a `.env` file in the root directory and define:

```sh
VITE_SOCKET_URL= //server socket URL
VITE_API_URL= //server API URL
```

### Running the Dashboard

Start the React dashboard using:

```sh
npm run dev
```

The dashboard will be accessible at `http://localhost:5173/`.

---

## Application Workflow

### Dashboard Initialization

1. Fetches available screens from the backend from socket.
2. Establishes a Socket connection for real-time updates.

### Content Management

1. **Creating & Editing Content**

   - Users build content using Fabric.js.
   - Content can include images, text, iframes, and live data.
   - New screen create and edit are saved via API reqeuest and pushed to connected screens only when pressing sync button.

2. **Content Preview & Publishing**

   - Users can preview content before deployment.
   - Published content is synced to the backend and screens via Sockets.

### Device Management

1. **Pairing Screens**

   - Screens connect using a screen ID.
   - Paired screens appear in the dashboard with status indicators.

2. **Monitoring & Control**
   - Displays a list of connected devices and their status.
   - Users can push updates to all screens for screen ID.

---

## Troubleshooting

- **Dashboard Not Loading**:

  - Ensure the backend is running and API URLs are correct.
  - Run `npm install` to ensure dependencies are installed.

- **Socket Issues**:

  - Verify `REACT_APP_SOCKET_URL` is correct.
  - Ensure the backend Socket server is running.

- **Content Not Syncing**:
- Click sync button to sync changes to all connected Electron App.

---

## Future Improvements

- Implement authentication and role-based access control.
- Add additional widgets for content customization.
- Improve error handling and UI feedback for failed syncs.
