# Running App

Running App is a local-first React application for recording runs, reviewing running activity, and tracking distance, time, pace, and goals.

## Getting Started

### Requirements

- Node.js and npm
- A modern browser with `localStorage` and `crypto.randomUUID()` support

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run Oxlint. |

## Use Cases

### Start from the home screen

The Home section is the starting point for a new session. It provides the `Record Run` action, which opens the run-entry form.

### Record a run

1. Select `Record Run` on Home.
2. Enter the distance in kilometres.
3. Enter the elapsed time as six digits in `HHMMSS` form. The form displays it as `HH:MM:SS`.
4. Review the calculated pace in minutes per kilometre.
5. Select `Save` to add the run, or `Cancel` to leave without saving.

Distance and time are required. A run cannot be saved when either value is zero or empty. Saved runs receive a generated ID and the current date and time.

### Review recent activity

The Activity section provides two ways to review recorded runs:

- A bar chart grouped by day.
- A recent-runs log showing the date, time of day, distance, elapsed time, and pace for each run.

The chart supports these ranges:

- This Week
- Last Week
- This Month

It also supports these metrics:

- Distance
- Time
- Best Pace

The chart range label shows the dates currently being displayed.

### Delete a recorded run

Each run in the Activity log has a delete action. Deleting a run removes it from the current list and from browser storage. The edit action is present visually but is not implemented yet.

### Create a running goal

1. Open Goals.
2. Select `ADD NEW GOAL`.
3. Choose a goal type: Total Distance, Total Time, or Best Pace.
4. Enter a positive target value.
5. Choose a future target date.
6. Select `Save`, or `Cancel` to discard the form.

Distance goals use kilometres. Time and pace goals use the same `HHMMSS` input format as run times. Goals are listed by start date and display their current and target values.

### View the profile section

The Profile section is available from the bottom navigation. It currently displays a placeholder heading and does not provide profile editing or account functionality.

## Data and Persistence

The app stores runs and goals in the browser's `localStorage`, so data remains available after refreshing the page in the same browser profile. There is no server, account system, synchronisation, or cross-device storage.

The current run form calculates and saves distance, elapsed time, pace, ID, and creation date. The Calories burnt and Elevation Gain fields are displayed, but their values are not currently included in saved run data.

## Technology

- React 19
- Vite
- Recharts for activity charts
- Lucide React for interface icons
- Oxlint for linting
