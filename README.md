# ProgressiveTrainer Frontend

A modern, responsive fitness tracking application built with React, TypeScript, and Vite.

## Features

- **Workout Tracking**: Manage and track your exercises.
- **Dynamic Dashboard**: View your current session status and metrics.
- **Drag-and-Drop**: Easily reorder exercises in your workout list.
- **Secure Authentication**: Integrated with Supabase.
- **Real-time Updates**: Changes reflect instantly across the dashboard and workout views.

## Getting Started

Follow these steps to run the project on your local machine:

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) installed. Using **npm** is recommended for package management.

### 2. Clone the Repository

```bash
git clone <your-github-repo-url>
cd modern-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

The project uses Supabase and n8n. These configurations are sensitive and were not pushed to GitHub.

1.  Create a file named `.env` in the root directory.
2.  Open `.env.example` in this folder and copy its content into your new `.env` file.
3.  Replace the placeholder values with your actual project credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_N8N_BASE_URL=your_n8n_workflow_url
    ```

### 5. Start Developing

Launch the local development server:

```bash
npm run dev
```

The application will typically be accessible at `http://localhost:5173`.

## Deployment

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` folder, ready for deployment to platforms like Vercel or Netlify.

---

## Credits

### Graphics & Assets

- **Icons**: [Trainer icons](https://www.flaticon.com/free-icons/trainer) created by Leremy - Flaticon.
- **3D Model**: [Male base muscular anatomy](https://skfb.ly/ouVoo) by CharacterZone, licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).
- **Libraries**: Lucide-React for component icons, Nivo for data visualization.