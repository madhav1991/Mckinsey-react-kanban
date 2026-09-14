# Rick and Morty React Kanban Board

A frontend-only Kanban board built with **React**, **TypeScript**, **Vite**, **Mantine UI**, **@dnd-kit**, and the **Rick and Morty GraphQL API**.

## Features

- **Three Columns Layout**: `To Do`, `Doing`, and `Done` columns with item counters.
- **Character Picker (GraphQL)**:
  - Powered by Mantine `Autocomplete`.
  - Queries `https://rickandmortyapi.com/graphql` with `characters(filter: { name: $name })`.
  - Debounced input changes (~300ms using `useDebouncedValue`).
  - Custom option rendering with character thumbnail avatar & name.
  - Loading and "No characters found" dropdown states handled.
  - Stores full character object (`id`, `name`, `image`) on item creation.
- **Drag & Drop**:
  - Built using `@dnd-kit/core` and `@dnd-kit/sortable`.
  - Move items between columns or reorder items within a column.
  - Inner card drag handle wrapping to keep outer Mantine Card padding clean.
- **State Management**:
  - Single `useReducer` managing all board operations (`ADD_ITEM`, `REORDER_ITEM`).
- **Completion Celebration**:
  - Triggers `canvas-confetti` when an item is moved into the `Done` column.

## Setup and Run Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at the URL shown in terminal (typically `http://localhost:5173`).

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **UI Components**: Mantine (`@mantine/core`, `@mantine/hooks`)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Effects**: `canvas-confetti`
- **API**: Rick and Morty GraphQL API (`https://rickandmortyapi.com/graphql`)