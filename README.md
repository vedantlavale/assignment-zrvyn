# Zorvyn Finance Dashboard

A high-end, professional SaaS finance dashboard built with Bun, Vite, React, and TypeScript. It features a sharp-edged, data-dense UI designed for precise personal finance monitoring, with a role-based management system and real-time visualization of income, expenses, and savings.

## Project Overview

Zorvyn transforms raw transaction data into actionable financial intelligence. It moves away from "vibe-coded" aesthetics toward a professional, technical visual language using a structured design system, high-contrast typography (DM Sans & DM Mono), and specialized data visualizations.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) — fast package management and local development
- **Bundler**: [Vite](https://vitejs.dev/) — low-friction React bundling and HMR
- **Framework**: [React 19](https://react.dev/) — component-driven UI with context-based state
- **Language**: [TypeScript](https://www.typescriptlang.org/) — strict typing for financial records and insights
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling with a custom sharp-edge design system
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) — customized primitives for tables, modals, and forms
- **Charts**: [Recharts](https://recharts.org/) — professional financial charts with unified custom tooltips
- **Typography**: DM Sans (Body) & DM Mono (Tabular Data/Numbers)
- **Icons**: [Lucide React](https://lucide.dev/) — sharp, consistent iconography

## Setup Instructions

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run production build
bun run build
```

## Feature Walkthrough

### 📊 Dashboard
The mission control for your finances.
- **Summary Cards**: Real-time balance, income, expenses, and savings rate with animated counters and month-over-month trend indicators.
- **Statistics (Balance Trend)**: A 6-month area chart showing income vs. expense momentum.
- **Expenses Breakdown**: A donut chart with a structured table legend for the top 5 expense categories.
- **Cash Flow Waterfall**: A diverging bar chart visualizing net monthly position (Income vs. Expenses).
- **Daily Spending**: A 30-day area chart showing granular day-to-day expense patterns.

### 💸 Transactions
A high-density ledger for record management.
- **Advanced Filtering**: Search by description, filter by type/category, and select date ranges.
- **Smart Sorting**: Sort by date or amount in ascending/descending order.
- **Role-Gated CRUD**: Admins can Add, Edit, or Delete transactions; Viewers get a clean read-only experience.
- **Persistence**: All changes are persisted to `localStorage` for a stateful experience without a backend.

### 💡 Insights
Automated financial signals derived from your history.
- **Highlight Cards**: Identification of highest spending, best savings month, and current savings ratio.
- **Smart Tip**: Dynamic financial advice based on current spending patterns.
- **Monthly Comparison**: Side-by-side bar chart comparison of income and expenses over time.

## Design System & UX

- **Sharp Edges**: A consistent 0px-4px border-radius language for a professional, technical look.
- **Typography Hierarchy**: Uppercase labels with generous tracking for headers; DM Mono for all currency and dates to ensure vertical alignment.
- **Unified Tooltips**: High-contrast chart tooltips with consistent formatting across all visualizations.
- **Theme Engine**: Complete Dark and Light mode support.
  - **Default**: White (Light) mode is enabled for all new users.
  - **Toggle**: Access via the Topbar icon.
  - **Hotkey**: Press `D` to toggle themes instantly.
  - **Persistence**: Remembers your preference via `localStorage`.

## Role Management

1. Use the **Role Selector** in the sidebar footer.
2. **Viewer**: Read-only mode with an info banner; ideal for demonstrations.
3. **Admin**: Unlocks the "Add Transaction" FAB and row-level Edit/Delete actions.

## Architecture

- **Context API**: Centralized state management for Transactions, Theme, and App Settings using `useReducer`.
- **Custom Hooks**: Decoupled logic for insights, transaction filtering, and theme switching.
- **Responsive Layout**: Flush edge-to-edge design that adapts from high-density desktop views to accessible mobile cards.

---

*Zorvyn — Sharp. Technical. Financial.*
