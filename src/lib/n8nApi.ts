
/**
 * Centralized API client for all n8n webhook calls.
 * Uses VITE_N8N_BASE_URL from .env (ngrok tunnel URL).
 */

const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678';

async function n8nFetch<T = any>(path: string, body: Record<string, any>): Promise<T> {
  const res = await fetch(`${N8N_BASE_URL}/webhook/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`n8n webhook error (${res.status}): ${text}`);
  }
  // Try JSON first, fall back to text (some endpoints like trainer-ai return plain text)
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}

// ─── Workout Logging ───────────────────────────────────────────

export interface LogWorkoutExercise {
  name: string;
  sets: { set_number: number; reps: number; weight: number; rpe?: number }[];
}

export async function logWorkout(
  userId: string,
  sessionDate: string,
  muscleGroup: string,
  exercises: LogWorkoutExercise[]
) {
  return n8nFetch('log-workout', {
    user_id: userId,
    session_date: sessionDate,
    muscle_group: muscleGroup,
    exercises,
  });
}

export interface DashboardMetrics {
  consistency: number;
  consistency_diff: number;
  workouts_total: number;
  workouts_diff: number;
  volume_monthly: number;
  volume_diff: number;
  streak: number;
  // New fields
  volume_today: number;
  volume_diff_yesterday: number;
  calories_today: number;
  calories_diff_yesterday: number;
  avg_intensity: number;
  target_minutes: number;
}

export const getDashboardMetrics = async (userId: string): Promise<DashboardMetrics> => {
  try {
    const data = await n8nFetch('get-dashboard-metrics', {
      user_id: userId
    });
    // n8n returns an array of items when respondWith="allIncomingItems"
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};


// ─── Session Management ────────────────────────────────────────

export async function listSessions(userId: string) {
  return n8nFetch('list-sessions', { user_id: userId });
}

export async function listDetailedSessions(userId: string) {
  return n8nFetch('list-detailed-sessions', { user_id: userId });
}

export async function deleteSession(sessionId: string) {
  return n8nFetch('delete-session', { session_id: sessionId });
}

// ─── Workout Exercises ─────────────────────────────────────────

export async function deleteExercise(exerciseId: string) {
  return n8nFetch('delete-exercise', { exercise_id: exerciseId });
}

export async function updateSet(
  setId: string,
  reps: number,
  weight: number,
  rpe?: number
) {
  return n8nFetch('update-set', { set_id: setId, reps, weight, rpe });
}

// ─── Relog ──────────────────────────────────────────────────────

export async function relogWorkout(userId: string, date: string) {
  return n8nFetch('relog-workout', { user_id: userId, date });
}

// ─── Progress Analytics ────────────────────────────────────────

export async function getProgressAnalytics(userId: string) {
  return n8nFetch('progress-analytics', { p_user_id: userId });
}

// ─── Personal Records ──────────────────────────────────────────

export async function syncPersonalRecords(userId: string) {
  return n8nFetch('sync-personal-records', { user_id: userId });
}

// ─── Calendar Data ─────────────────────────────────────────────

export async function getCalendarData(userId: string) {
  return n8nFetch('calendar-data', { p_user_id: userId });
}

export interface WorkoutCalendarMetrics {
  current_streak: number;
  completion_rate: number;
  total_workouts: number;
}

export async function getWorkoutCalendarMetrics(userId: string): Promise<WorkoutCalendarMetrics> {
  try {
    const data = await n8nFetch('workout-calendar-metrics', {
      user_id: userId
    });
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Error fetching workout calendar metrics:', error);
    throw error;
  }
}

// ─── Trainer AI ────────────────────────────────────────────────

export async function sendTrainerAIMessage(
  chatInput: string,
  sessionId: string,
  userId: string
) {
  return n8nFetch('trainer-ai', {
    chatInput,
    sessionId,
    user_id: userId,
  });
}

// ─── Update Profile ────────────────────────────────────────────

export async function updateProfile(
  userId: string,
  name: string,
  email: string,
  phone: string
) {
  return n8nFetch('update-profile', {
    user_id: userId,
    name,
    email,
    phone,
  });
}
