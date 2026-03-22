# Room Management System - Project Summary

## Overview
Room Management System is a front-desk operations app built with React and Vite. It handles room management, booking workflows, check-in/check-out actions, history tracking, and calendar-based availability monitoring.

## Highlighted: What Is Used
- **React features used:** `useState`, `useEffect`, conditional rendering, mapped lists, event handlers, prop passing.
- **Browser APIs used:** `localStorage`, `CustomEvent`, `window.dispatchEvent`, `Date`.
- **Tooling used:** Vite, ESLint.
- **Styling approach used:** Feature-scoped CSS files + shared global tokens.
- **Data strategy used:** Client-side state with local persistence (no backend yet).

## Architecture Snapshot
- **Framework:** React
- **Build Tool:** Vite
- **State Pattern:** Local component state + browser storage
- **Persistence:** `localStorage` (`activeBookings`, `bookingHistory`)
- **Cross-Component Sync:** Custom browser events (`bookings-updated`, `navigate-page`)

## Component Lessons

### `App.jsx`
**Lesson: Lightweight page routing for internal dashboards**
- Uses a single `currentPage` state with switch-based rendering.
- Keeps page-level control centralized and easy to extend.
- Works well for compact tools where full router setup is not yet required.
- **Used:** `useState`, conditional rendering, component composition.

### `Sidebar.jsx`
**Lesson: Data-driven navigation design**
- Menu options are defined in an array for easy updates.
- Active-state feedback improves navigation clarity.
- Combines branding, navigation, and profile context in one reusable shell.
- **Used:** array mapping for nav items, click handlers, active state styling.

### `Home.jsx`
**Lesson: Summary-first dashboard UX**
- Emphasizes high-value operational information at a glance.
- Uses card-based composition to keep scanning fast.
- Supports the receptionist workflow with quick visual status cues.
- **Used:** dashboard cards, derived display values, layout-first UI composition.

### `Room.jsx`
**Lesson: CRUD plus derived room occupancy status**
- Handles room create, update, and delete operations.
- Derives room occupancy state from booking data events.
- Separates editable metadata (room details) from live occupancy behavior.
- **Used:** form state handling, CRUD actions, `bookings-updated` event listeners.

### `Bookings.jsx`
**Lesson: Validation and booking integrity rules**
- Validates required fields and date ordering.
- Prevents overlapping reservations for the same room.
- Persists active/history records and emits updates for other modules.
- Implements check-in/check-out transitions with basic billing total logic.
- **Used:** `useState`, `useEffect`, form validation, overlap checks, `localStorage`, custom events, date arithmetic.

### `Calendar.jsx`
**Lesson: Time-based UI with direct operational actions**
- Displays month-grid occupancy status (`check-in`, `occupied`, `check-out`, `available`).
- Shows day-level room availability and booked guests.
- Allows quick actions (check-in, check-out, edit booking) directly from date context.
- Uses a custom confirmation modal for safer checkout actions.
- **Used:** calendar grid logic, date comparisons, booking status badges, contextual action triggers.

### `History.jsx`
**Lesson: Read-optimized audit views**
- Stores completed stays as historical records.
- Supports traceability for timing and cost outcomes.
- Keeps historical data flow separate from active booking operations.
- **Used:** table/list rendering, historical filtering patterns, read-only presentation.

### `Guest.jsx`
**Lesson: Feature modularity for domain separation**
- Keeps guest-specific concerns separate from booking mechanics.
- Supports future expansion of profile-level features without coupling.
- **Used:** modular component boundaries and feature-scoped styles.

### `Settings.jsx`
**Lesson: Configurable behavior in one control surface**
- Centralizes system-level preferences and options.
- Improves maintainability by isolating settings from transactional screens.
- **Used:** grouped setting controls, centralized preference UI patterns.

## Styling Lessons

### `App.css` + `Sidebar.css`
**Lesson: Stable application shell layout**
- Fixed sidebar with a scrollable content region.
- Responsive behavior ensures usability on smaller screens.

### Feature CSS files (`Bookings.css`, `Room.css`, `Calendar.css`, `Home.css`, `Guest.css`, `History.css`, `Settings.css`)
**Lesson: Scoped styling by feature module**
- Reduces style collision risk between pages.
- Makes feature-level visual iteration safer and faster.

### `index.css`
**Lesson: Global tokens and baseline consistency**
- Defines shared color, typography, and spacing variables.
- Provides consistent defaults for app-wide rendering behavior.
- **Used:** CSS variables/tokens, base reset, global typography and spacing rules.

## Data and Event Flow Lessons
- `localStorage` can be effective for prototype-level persistence.
- Custom events provide a lightweight alternative to global state libraries for small apps.
- Derived views (`Room`, `Calendar`) react to booking events rather than duplicating business rules.

## Current Status
- Booking edit handoff has been stabilized to avoid synchronous state updates in effects.
- Calendar actions and booking workflows are integrated.
- The project builds successfully and is ready for backend integration.

## Suggested Next Steps
1. Add backend APIs and replace `localStorage` with server persistence.
2. Introduce React Router for deep-linking and browser history support.
3. Add automated tests for overlap checks and state transitions.
4. Centralize date/cost helpers in shared utility modules.

