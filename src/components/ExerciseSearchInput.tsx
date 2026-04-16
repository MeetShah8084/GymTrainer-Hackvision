import React, { useState, useEffect, useRef } from 'react';

export interface ExerciseOption {
  id: string; // The dataset uses string IDs
  name: string;
  category: string;
  equipment: string;
  primaryMuscles: string[];
}

export interface ExerciseSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectExercise: (name: string, isBodyweight: boolean) => void;
  muscleGroupFilter?: string; // Optional filter from logger (e.g. "Chest", "Arms")
  placeholder?: string;
  className?: string;
}

let exercisesCache: ExerciseOption[] | null = null;
let fetchPromise: Promise<ExerciseOption[]> | null = null;

export const fetchLocalExercises = async (): Promise<ExerciseOption[]> => {
  if (exercisesCache) return exercisesCache;
  if (!fetchPromise) {
    fetchPromise = fetch('/exercises.json')
      .then(res => res.json())
      .then(data => {
        exercisesCache = data;
        return data;
      });
  }
  return fetchPromise;
};

const MUSCLE_MAP: Record<string, string> = {
  "chest": "Chest",
  "lats": "Back",
  "lower back": "Back",
  "middle back": "Back",
  "traps": "Back",
  "biceps": "Arms",
  "forearms": "Arms",
  "triceps": "Arms",
  "shoulders": "Arms",
  "calves": "Legs",
  "glutes": "Legs",
  "hamstrings": "Legs",
  "quadriceps": "Legs",
  "abductors": "Legs",
  "adductors": "Legs",
  "abdominals": "Core",
  "neck": "Arms"
};

export const ExerciseSearchInput: React.FC<ExerciseSearchInputProps> = ({
  value,
  onChange,
  onSelectExercise,
  muscleGroupFilter,
  placeholder = "e.g. Bench Press",
  className = "w-full bg-slate-50 dark:bg-[#1a1a1a] border border-primary/30 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-sans"
}) => {
  const [query, setQuery] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<ExerciseOption[]>([]);
  const [crossGroupMatch, setCrossGroupMatch] = useState<{name: string, group: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150); // Lowered to 150ms since it's local memory
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        setCrossGroupMatch(null);
        return;
      }
      setIsLoading(true);
      setCrossGroupMatch(null);
      try {
        const data = await fetchLocalExercises();
        
        const searchTerms = debouncedQuery.toLowerCase().split(/[\\s-]+/).filter(Boolean);
        
        let opts = data.filter((d: any) => {
          const lowerName = d.name.toLowerCase();
          return searchTerms.every(term => {
             const singular = term.endsWith('s') ? term.slice(0, -1) : term;
             return lowerName.includes(term) || lowerName.includes(singular);
          });
        });

        const query = debouncedQuery.toLowerCase().trim();
        const qSingular = query.endsWith('s') ? query.slice(0, -1) : query;

        opts.sort((a: any, b: any) => {
          const aLower = a.name.toLowerCase();
          const bLower = b.name.toLowerCase();
          
          const aExact = aLower === query || aLower === qSingular;
          const bExact = bLower === query || bLower === qSingular;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          const aStarts = aLower.startsWith(query) || aLower.startsWith(qSingular);
          const bStarts = bLower.startsWith(query) || bLower.startsWith(qSingular);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;

          return aLower.length - bLower.length;
        });

        let filteredOpts = opts;
        let outsideMatch = null;

        if (muscleGroupFilter && muscleGroupFilter !== 'PR') {
          filteredOpts = opts.filter((o: any) => {
            if (muscleGroupFilter === 'Cardio') {
              return o.category === 'cardio';
            }
            return o.primaryMuscles.some((m: string) => MUSCLE_MAP[m] === muscleGroupFilter);
          });

          if (filteredOpts.length === 0 && opts.length > 0) {
            const firstOutside = opts[0];
            let otherGroup = "Other";
            if (firstOutside.category === 'cardio') {
              otherGroup = "Cardio";
            } else if (firstOutside.primaryMuscles && firstOutside.primaryMuscles.length > 0) {
              const mapped = MUSCLE_MAP[firstOutside.primaryMuscles[0]];
              if (mapped) otherGroup = mapped;
            }
            outsideMatch = { name: firstOutside.name, group: otherGroup };
          }
        }
        
        setSuggestions(filteredOpts.slice(0, 30)); // Top 30 for performance
        setCrossGroupMatch(outsideMatch);
      } catch (e) {
        console.error("Failed to fetch local suggestions", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery, muscleGroupFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt: ExerciseOption) => {
    setQuery(opt.name);
    onChange(opt.name);
    setIsOpen(false);

    // Precise offline bodyweight detection via equipment flag
    const isBw = opt.equipment === "body only" || opt.equipment === "body weight";
    onSelectExercise(opt.name, isBw);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        className={className}
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
      />
      
      {isOpen && (debouncedQuery.length >= 2) && (
        <div className="absolute z-[100] w-full mt-1 bg-white dark:bg-[#1e1511] shadow-2xl rounded-xl border border-primary/20 max-h-64 overflow-y-auto custom-scrollbar text-left">
          {isLoading ? (
            <div className="p-3 text-slate-500 text-sm">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map(s => (
              <div
                key={s.id}
                onClick={() => handleSelect(s)}
                className="p-3 hover:bg-slate-100 dark:hover:bg-[#2a1d17] cursor-pointer border-b border-primary/10 last:border-0 transition-colors"
              >
                <div className="font-medium text-slate-800 dark:text-white capitalize">{s.name}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-primary/80 capitalize">{s.primaryMuscles.join(", ")}</span>
                  <span className="text-xs text-slate-400 capitalize">• {s.equipment}</span>
                </div>
              </div>
            ))
          ) : crossGroupMatch ? (
             <div className="p-3 bg-red-500/10 border-l-4 border-red-500 cursor-default">
               <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                 "{crossGroupMatch.name}" belongs to the {crossGroupMatch.group} group.
               </span>
             </div>
          ) : (
            <div className="p-3 text-slate-500 text-sm">No matches found</div>
          )}
        </div>
      )}
    </div>
  );
}
