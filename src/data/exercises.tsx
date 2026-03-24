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
