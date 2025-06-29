"use client";

import { useState, useEffect } from "react";
import ExerciseLibrary from "./ExerciseLibrary";
import WorkoutPlan from "./WorkoutPlan";
import { createWorkoutTemplate } from "@/lib/api";
import toast from "react-hot-toast";

interface Exercise {
  id: number;
  name: string;
  category: string;
  muscleGroup: string;
}

interface WorkoutExercise extends Exercise {
  sets: number;
  reps: number;
  weight: string;
  notes?: string;
}

const categories = ["All", "Strength", "Cardio", "Flexibility", "Balance", "Core"];

// Ключи для localStorage
const DRAFT_KEY = 'workout-draft';
const DRAFT_NAME_KEY = 'workout-draft-name';

export default function WorkoutsPage() {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [planName, setPlanName] = useState("");

  // Загрузка черновика при монтировании компонента
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    const savedName = localStorage.getItem(DRAFT_NAME_KEY);
    
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setWorkoutExercises(parsedDraft);
      } catch (error) {
        console.error('Error parsing saved draft:', error);
      }
    }
    
    if (savedName) {
      setPlanName(savedName);
    }
  }, []);

  // Сохранение черновика при изменении упражнений
  useEffect(() => {
    if (workoutExercises.length > 0 || planName) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(workoutExercises));
      localStorage.setItem(DRAFT_NAME_KEY, planName);
    }
  }, [workoutExercises, planName]);

  const handleAddExercise = (exercise: Exercise) => {
    if (workoutExercises.some(e => e.id === exercise.id)) {
      toast.error("This exercise is already in the workout plan");
      return;
    }
    setWorkoutExercises(prev => [
      ...prev,
      {
        ...exercise,
        sets: 3,
        reps: 10,
        weight: '',
        notes: ''
      }
    ]);
    toast.success("Exercise added to workout plan");
  };

  const handleUpdateExercise = (index: number, updated: Partial<WorkoutExercise>) => {
    setWorkoutExercises(prev => prev.map((ex, i) => i === index ? { ...ex, ...updated } : ex));
  };

  const handleRemoveExercise = (index: number) => {
    setWorkoutExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorderExercises = (newExercises: WorkoutExercise[]) => {
    setWorkoutExercises(newExercises);
  };

  const handleSaveWorkout = async () => {
    try {
      await createWorkoutTemplate({
        name: planName,
        exercises: workoutExercises.map(ex => ({
          exerciseId: ex.id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          notes: ex.notes,
        }))
      });
      
      // Очищаем черновик после успешного сохранения
      setWorkoutExercises([]);
      setPlanName("");
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_NAME_KEY);
      
      toast.success("Workout template saved!");
    } catch (error) {
      console.error('Error saving workout template:', error);
      toast.error("Failed to save workout template");
    }
  };

  // Функция для очистки черновика
  const clearDraft = () => {
    setWorkoutExercises([]);
    setPlanName("");
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_NAME_KEY);
    toast.success("Draft cleared");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44]">Workout Builder</h1>
            <p className="text-sm text-[#6B7280] mt-1">Create your own workout</p>
          </div>
        </div>
        <div className="flex gap-6">
          <ExerciseLibrary onSelectExercise={handleAddExercise} />
          <WorkoutPlan
            exercises={workoutExercises}
            onUpdateExercise={handleUpdateExercise}
            onRemoveExercise={handleRemoveExercise}
            onReorderExercises={handleReorderExercises}
            planName={planName}
            setPlanName={setPlanName}
            onSave={handleSaveWorkout}
            onClearDraft={clearDraft}
          />
        </div>
      </div>
    </div>
  );
}