import React from 'react';
import { Dumbbell, Activity, Repeat } from 'lucide-react';

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
}

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const d0 = new Date(today);
const d1 = new Date(today); d1.setDate(today.getDate() - 1);
const d3 = new Date(today); d3.setDate(today.getDate() - 3);

export const initialCompletedExercises: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    timeInfo: '14:20 • Muscle Pump Gym • Chest',
    date: formatDate(d0),
    sets: 4,
    reps: '10, 8, 8, 6',
    weight: '85 kg',
    imageAlt: 'Close up of a heavy barbell in a gym',
    imageSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
    icon: <Dumbbell className="hidden md:block w-7 h-7" />
  },
  {
    id: '2',
    name: 'Dumbbell Lateral Raise',
    timeInfo: '12:15 • Muscle Pump Gym • Shoulders',
    date: formatDate(d0),
    sets: 3,
    reps: '15, 15, 12',
    weight: '12 kg',
    imageAlt: 'Dumbbells on a rack in a premium gym',
    imageSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop',
    icon: <Activity className="hidden md:block w-7 h-7" />
  },
  {
    id: '3',
    name: 'Seated Row',
    timeInfo: '10:30 • Muscle Pump Gym • Back',
    date: formatDate(d1),
    sets: 4,
    reps: '12, 10, 10, 8',
    weight: '60 kg',
    imageAlt: 'Seated Row machine',
    imageSrc: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
    icon: <Activity className="hidden md:block w-7 h-7" />
  },
  {
    id: '4',
    name: 'Cable Tricep Pushdown',
    timeInfo: '08:45 • Home Gym • Triceps',
    date: formatDate(d3),
    sets: 3,
    reps: '12, 12, 12',
    weight: '25 kg',
    imageAlt: 'Lat pull down machine detail',
    imageSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop',
    icon: <Repeat className="hidden md:block w-7 h-7" />
  }
];

export const initialIncompleteExercises: Exercise[] = [
  {
    id: 'inc-1',
    name: 'Incline Dumbbell Press',
    timeInfo: 'Current Session • Chest',
    sets: 3,
    reps: '10, 10, 8',
    weight: '30 kg',
    imageAlt: 'Incline Dumbbell Press',
    imageSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop',
    icon: <Dumbbell className="hidden md:block w-7 h-7" />
  },
  {
    id: 'inc-2',
    name: 'Overhead Press',
    timeInfo: 'Current Session • Shoulders',
    sets: 4,
    reps: '8, 8, 8, 8',
    weight: '45 kg',
    imageAlt: 'Overhead Press',
    imageSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
    icon: <Activity className="hidden md:block w-7 h-7" />
  },
  {
    id: 'inc-3',
    name: 'Pec Deck Fly',
    timeInfo: 'Current Session • Chest',
    sets: 3,
    reps: '15, 12, 12',
    weight: '50 kg',
    imageAlt: 'Pec Deck Fly',
    imageSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop',
    icon: <Repeat className="hidden md:block w-7 h-7" />
  }
];
