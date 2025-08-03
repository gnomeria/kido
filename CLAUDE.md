# Project Brief: Kido - The Modern Baby Growth Tracker App

## 1. Vision & Overview

**Project Name:** Kido

**Core Idea:** A clean, fast, and intuitive mobile-first web application for modern parents to track their baby's key growth metrics: weight, height, and head circumference.

**Value Proposition:** Kido simplifies growth tracking by presenting data on beautiful, easy-to-understand charts based on official World Health Organization (WHO) standards. It replaces manual paper charts with a secure, accessible, and shareable digital log.

## 2. Core Features (Functional Requirements)

### 2.1. User & Profile Management
- **User Authentication:** Simple and secure sign-up/login via email/password and social providers (Google/Apple).
- **Child Profiles:**
    - Ability to create and manage profiles for one or more children.
    - Each profile requires: Name, Date of Birth (DOB), and Sex at birth (to apply the correct growth charts).

### 2.2. Data Entry
- An intuitive, single-screen form to add a new measurement entry.
- Fields required:
    - `Date of Measurement`
    - `Weight` (user can select units: kg or lbs/oz).
    - `Height/Length` (user can select units: cm or inches).
    - `Head Circumference` (user can select units: cm or inches).
    - `Notes` (optional).

### 2.3. Dashboard & Visualization
- The main screen should display the most recent measurements for the selected child.
- **Interactive Growth Charts:**
    - Generate separate charts for: Weight-for-age, Height-for-age, Head Circumference-for-age, and Weight-for-height.
    - Each chart must plot the child's measurement history.
    - **Crucially, overlay the standard WHO percentile curves (e.g., 3rd, 15th, 50th, 85th, 97th percentiles) onto the chart.**
    - Charts should be interactive (e.g., hover over a point to see details).

### 2.4. Data History
- A reverse-chronological list of all measurement entries, with options to edit or delete.

## 3. Technology Stack & Design Philosophy

- **Framework:** **Astro**. The project will be built using the Astro framework to ensure a fast, content-focused experience.
- **Styling:** **Tailwind CSS**. All styling will be implemented using the Tailwind CSS utility-first framework.
- **Component Prototyping (MCP):** UI components will be built as reusable Astro components, following the design principles and structure of a methodology referred to as **"Context7"**.
- **Backend:** A headless backend is preferred. **Supabase** or **Firebase** are strong candidates due to their authentication, database, and serverless function offerings which integrate well with Astro.
- **Data Source:** All percentile data for growth charts **must** be sourced directly from the official **WHO Child Growth Standards**.

## 4. Actionable First Steps for Development

1.  **Initialize Project:** Set up a new Astro project and officially integrate Tailwind CSS according to Astro's documentation.
2.  **Define "Context7" Base Components:** Based on the "Context7" methodology, create the foundational UI components (`Card.astro`, `Button.astro`, `Input.astro`, `ChartContainer.astro`) styled with Tailwind CSS.
3.  **Set Up Backend:** Initialize a new project on a chosen BaaS provider (e.g., Supabase). Define the database schema for `users`, `children`, and `measurements`. Set up authentication rules.
4.  **Build Core Pages & Data Flow:** Create the main pages/routes (`/login`, `/dashboard`, `/add-entry`). Implement the logic within these Astro pages to securely fetch data from and submit data to the backend.

## 5. Development Guidelines

### Package Manager
- **ALWAYS use `bun`** instead of npm for all package management and script running.

### System Commands
- **ALWAYS use `/bin/rm`** instead of `rm` for file deletion since `rip` tool is not available.
- **NEVER run `bun run dev`** as it's an open-ended command that will cause blocking. Only use `bun run build` or similar finite commands for testing.

### UI Components
- **ALWAYS use DaisyUI components** instead of creating custom components or using manual Tailwind classes.
- **ALWAYS check Context7 DaisyUI documentation** before implementing any UI component.
- **NEVER create complex custom JavaScript** when DaisyUI provides the component out of the box.
- Use `card`, `btn`, `alert`, `modal`, `hero`, `badge`, etc. instead of manual styling.

### Progress Tracking
- Always update `tasks.md` with current progress and use it as a checkpoint for task tracking.
- Track all todos and progress in tasks.md file.
