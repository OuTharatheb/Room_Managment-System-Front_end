# Room Management System - Updated Project Report

Date: March 29, 2026

## Executive Summary
Room Management System is a React + Vite front-desk application for handling room reservations, occupancy tracking, check-in/check-out workflows, calendar-based operations, and post-stay history.

The current build is a functional frontend prototype with client-side persistence. Core workflows are implemented and synchronized across modules using localStorage plus browser custom events.

## Tech Stack
- Frontend: React 19
- Build and Dev Server: Vite 8
- Linting: ESLint 9
- Language: JavaScript (ES modules)
- Styling: Component/page-level CSS files with shared global styles

## Implemented Modules and Behavior

### 1) App Shell and Navigation
- App-level page navigation is state-based (`currentPage`) with switch rendering.
- Sidebar navigation uses a data-driven menu and active-page highlight.
- Cross-module page jump is implemented through a custom event (`navigate-page`).

### 2) Bookings (Core Transaction Module)
- Supports create, edit, delete, check-in, and check-out actions.
- Validations include required fields and check-out after check-in.
- Prevents date overlap for the same room against both active bookings and historical records.
- Persists data in:
	- `activeBookings`
	- `bookingHistory`
- On every booking mutation, dispatches `bookings-updated` to refresh dependent screens.
- Includes search filtering and embedded history table toggle.

### 3) Calendar (Operational Day View)
- Renders a 6x7 month grid with day status markers:
	- `checkin`
	- `occupied`
	- `checkout`
	- `available`
- Shows selected-day occupancy and available rooms.
- Provides inline actions:
	- Check-In
	- Check-Out (with confirmation modal)
	- Edit booking (handoff to Bookings page)

### 4) Rooms
- Maintains editable room metadata (name, capacity, floor, amenities).
- Supports add/edit/delete room operations.
- Derives runtime occupancy status from active bookings (`booked`, `checked-in`) except rooms set to `maintenance`.
- Prevents manual status overrides while booking-controlled states are active.

### 5) Home Dashboard
- Displays operational summary cards:
	- Total rooms
	- Available
	- Booked
	- Guests
- Reads latest booking data via event-based refresh.
- Includes searchable room card list.

### 6) Guests
- Builds a guest directory from active + historical bookings.
- Deduplicates guest profiles by normalized name/email/phone key.
- Computes profile metrics:
	- Total visits
	- Last stay
	- Member since
- Classifies guest tier:
	- New
	- Regular
	- VIP

### 7) History
- Loads historical check-out records from `bookingHistory`.
- Computes derived fields:
	- Duration (nights)
	- Revenue totals
	- Average stay
- Supports filtering by guest search and room.

### 8) Settings
- Includes tabbed settings UI for general, booking, notifications, and display options.
- Current behavior is UI-state only (no persistence layer for settings yet).

## Data and Synchronization Model

### Persistence Keys
- `activeBookings`
- `bookingHistory`
- `pendingBookingEditId` (calendar-to-bookings edit handoff)

### Sync Mechanisms
- `window.dispatchEvent(new CustomEvent('bookings-updated'))`
- `window.addEventListener('bookings-updated', ...)`
- `window.addEventListener('storage', ...)`

This model keeps modules loosely coupled while enabling near real-time UI updates across tabs and pages.

## Current Strengths
- End-to-end reservation lifecycle is implemented.
- Calendar and booking tables are operationally connected.
- Guest and history views are data-driven from real activity.
- Architecture is modular and readable for frontend-only iteration.

## Known Limitations
- No backend or API integration; all data is local to browser storage.
- No authentication/authorization model.
- No automated tests currently included.
- Settings are not persisted.
- Currency and date handling are fixed/simple and not locale-aware.
- Some data is duplicated in module-level constants (rooms/rates), which can drift over time.

## Risk Notes
- `localStorage` can be cleared by the browser/user, causing data loss.
- Multi-user scenarios are not supported in current architecture.
- Business rules are distributed across components rather than centralized domain utilities.

## Recommended Next Phase
1. Introduce a backend API and move booking/history/rooms to server persistence.
2. Extract shared domain utilities (date overlap, pricing, status transitions) into common modules.
3. Add automated tests for overlap validation, check-in/out transitions, and calendar status mapping.
4. Persist settings and unify configuration across modules.
5. Optionally migrate to route-based navigation for deep links and browser history behavior.

## Overall Status
Frontend prototype is feature-complete for single-operator demo use and is ready for backend integration and test hardening.

