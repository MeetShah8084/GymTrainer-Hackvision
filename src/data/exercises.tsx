export interface Exercise {
  id: string;
  name: string;
  timeInfo: string;
  date?: string; // Format: YYYY-MM-DD
  sets: number;
  reps: string;
  weight: string;
  imageAlt: string;
  imageSrc: string;
  icon: React.ReactNode;
  setIds?: string[];
}

import React from 'react';

export const formatDate = (date: Date) => {
  return [
    date.getFullYear(),
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2)
  ].join('-');
};

// Dummy data removed — exercises are now fetched from the n8n backend
export const initialCompletedExercises: Exercise[] = [];
export const initialIncompleteExercises: Exercise[] = [];

export const EXERCISES_BY_MUSCLE: Record<string, string[]> = {
  Chest: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Chest Flyes', 'Push-ups', 'Cable Crossovers', 'Decline Press'],
  Back: ['Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Deadlift', 'T-Bar Row', 'Seated Cable Row'],
  Legs: ['Squats', 'Leg Press', 'Lunges', 'Romanian Deadlift', 'Calf Raises', 'Leg Extensions'],
  Arms: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Skullcrushers', 'Preacher Curls', 'Tricep Dips'],
  Abs: ['Crunches', 'Planks', 'Cable Crunches', 'Leg Raises', 'Russian Twists', 'Ab Wheel Rollouts'],
  Cardio: ['Running', 'Cycling', 'Swimming', 'Rowing', 'Jump Rope', 'Stair Climber']
};

export const BODYWEIGHT_EXERCISES = ['Push-ups', 'Pull-ups', 'Crunches', 'Planks', 'Leg Raises', 'Russian Twists', 'Ab Wheel Rollouts', 'Tricep Dips'];
