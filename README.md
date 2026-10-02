# Match Fit

A React and Vite tennis performance program tracker.

## Run locally

```bash
npm install
npm run dev
```

The development command starts the Vite app and the local JSON storage API. Usernames and progress are stored in `data/users/` on the machine running the app; that directory is excluded from Git.

To serve a production build locally:

```bash
npm run build
npm start
```

Other devices can share the same history when they connect to the same app server. This MVP file storage is tied to that server machine; when moving/hosting the app, replace it with a proper database.

## Structure

- `src/main.jsx` boots the React application.
- `src/App.jsx` is the application boundary.
- `src/styles.css` contains global document defaults.
- `tennis-performance-app.jsx` contains the Match Fit feature UI, program data, and views.
