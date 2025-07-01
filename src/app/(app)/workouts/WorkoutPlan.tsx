"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WorkoutExercise {
  id: number;
  name: string;
  category: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: string;
  notes?: string;
}

interface WorkoutPlanProps {
  exercises: WorkoutExercise[];
  onUpdateExercise: (index: number, updated: Partial<WorkoutExercise>) => void;
  onRemoveExercise: (index: number) => void;
  onReorderExercises: (exercises: WorkoutExercise[]) => void;
  planName: string;
  setPlanName: (name: string) => void;
  onSave: () => void;
  onClearDraft: () => void;
}

// Компонент для сортируемого элемента упражнения
function SortableExerciseItem({ 
  exercise, 
  index, 
  onUpdateExercise, 
  onRemoveExercise 
}: { 
  exercise: WorkoutExercise; 
  index: number; 
  onUpdateExercise: (index: number, updated: Partial<WorkoutExercise>) => void;
  onRemoveExercise: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{exercise.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                exercise.category === 'Strength' ? 'bg-violet-100 text-violet-700' :
                exercise.category === 'Cardio' ? 'bg-blue-100 text-blue-700' :
                exercise.category === 'Flexibility' ? 'bg-green-100 text-green-700' :
                exercise.category === 'Balance' ? 'bg-yellow-100 text-yellow-700' :
                exercise.category === 'Core' ? 'bg-pink-100 text-pink-700' :
                'bg-gray-100 text-gray-700'}
              `}>{exercise.category}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemoveExercise(index)}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sets</label>
          <Input
            type="number"
            value={exercise.sets}
            onChange={(e) => onUpdateExercise(index, { sets: parseInt(e.target.value) })}
            min={1}
            className="bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Reps</label>
          <Input
            type="number"
            value={exercise.reps}
            onChange={(e) => onUpdateExercise(index, { reps: parseInt(e.target.value) })}
            min={1}
            className="bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Weight</label>
          <Input
            type="text"
            value={exercise.weight}
            onChange={(e) => onUpdateExercise(index, { weight: e.target.value })}
            placeholder="lbs"
            className="bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Notes (optional)</label>
        <Input
          value={exercise.notes}
          onChange={(e) => onUpdateExercise(index, { notes: e.target.value })}
          placeholder="Add notes..."
          className="bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
        />
      </div>
    </div>
  );
}

export default function WorkoutPlan({ 
  exercises, 
  onUpdateExercise, 
  onRemoveExercise, 
  onReorderExercises,
  planName, 
  setPlanName, 
  onSave,
  onClearDraft
}: WorkoutPlanProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = exercises.findIndex(ex => ex.id === active.id);
      const newIndex = exercises.findIndex(ex => ex.id === over?.id);
      
      const newExercises = arrayMove(exercises, oldIndex, newIndex);
      onReorderExercises(newExercises);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Workout Plan</h2>

      {/* Блок с названием и кнопками вверху */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <Input
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="Workout name (e.g. Strength Training - Intermediate)"
          className="mb-4 bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
        />
        <div className="flex gap-3">
          <Button
            className="flex-1 font-medium py-3 rounded-lg transition-colors"
            variant="success"
            onClick={onSave}
            disabled={!planName || exercises.length === 0}
          >
            Save Workout
          </Button>
          {(exercises.length > 0 || planName) && (
            <Button
              variant="danger"
              className="px-6 py-3"
              onClick={onClearDraft}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Список упражнений */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={exercises.map(ex => ex.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <SortableExerciseItem
                key={exercise.id}
                exercise={exercise}
                index={index}
                onUpdateExercise={onUpdateExercise}
                onRemoveExercise={onRemoveExercise}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

    </div>
  );
} 