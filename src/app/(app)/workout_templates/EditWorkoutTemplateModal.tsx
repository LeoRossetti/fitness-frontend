"use client";

import { useEffect, useState } from "react";
import { getWorkoutTemplateById, updateWorkoutTemplate } from "@/lib/api";
import { ServerWorkoutTemplate, Exercise } from "@/types/types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import toast from 'react-hot-toast';
import { Trash2, Plus, GripVertical } from 'lucide-react';

type Props = {
  templateId: number;
  onClose: () => void;
  onUpdated?: (template: ServerWorkoutTemplate) => void;
};

interface ExerciseFormData {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: string;
  notes: string;
}

export default function EditWorkoutTemplateModal({ templateId, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    exercises: [] as ExerciseFormData[]
  });

  // Загружаем упражнения для выбора
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setExercises(data.exercises || []);
        }
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  // Загружаем данные шаблона
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        console.log('Fetching template with ID:', templateId);
        const response = await getWorkoutTemplateById(templateId);
        console.log('Template data received:', response);
        
        // Сервер возвращает объект с полем template
        const data = (response as any).template || response;
        console.log('Template data:', data);
        console.log('Exercises from server:', data.Exercises);
        
        // Проверяем что Exercises существует и является массивом
        if (!data.Exercises || !Array.isArray(data.Exercises)) {
          console.warn('No exercises found in template or invalid data structure');
          setFormData({
            name: data.name || '',
            exercises: []
          });
          return;
        }
        
        setFormData({
          name: data.name || '',
          exercises: data.Exercises.map((ex: any) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            notes: ex.notes
          }))
        });
      } catch (error) {
        console.error("Failed to fetch template:", error);
        toast.error('Failed to load template');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExerciseChange = (index: number, field: keyof ExerciseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        exerciseId: 0,
        sets: 3,
        reps: 10,
        weight: '',
        notes: ''
      }]
    }));
  };

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  // Функции для перетаскивания
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setFormData(prev => {
      const newExercises = [...prev.exercises];
      const draggedExercise = newExercises[draggedIndex];
      
      // Удаляем элемент из старой позиции
      newExercises.splice(draggedIndex, 1);
      // Вставляем в новую позицию
      newExercises.splice(dropIndex, 0, draggedExercise);
      
      return {
        ...prev,
        exercises: newExercises
      };
    });
    
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем что все упражнения имеют валидный exerciseId
    const invalidExercises = formData.exercises.filter(ex => ex.exerciseId === 0);
    if (invalidExercises.length > 0) {
      toast.error(`Please select exercises for ${invalidExercises.length} exercise(s)`);
      return;
    }
    
    setLoading(true);

    try {
      const updatedTemplate = await updateWorkoutTemplate(templateId, formData);
      onUpdated?.(updatedTemplate);
      onClose();
      toast.success('Template updated successfully');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('An error occurred while updating the template');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) return <div>Loading...</div>;

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Workout Template">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Template Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            placeholder="Upper Body Strength"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Exercises
            </label>
            <Button
              type="button"
              onClick={addExercise}
              className="flex items-center gap-1 text-sm"
              variant="default"
            >
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          </div>

          <div className="space-y-3">
            {formData.exercises.map((exercise, index) => (
              <div 
                key={index} 
                className={`border border-gray-200 rounded-lg p-3 ${
                  exercise.exerciseId === 0 ? 'border-red-300 bg-red-50' : ''
                } ${
                  draggedIndex === index ? 'opacity-50 bg-gray-100' : ''
                }`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                style={{ cursor: 'grab' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Exercise {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600">Exercise</label>
                    <select
                      value={exercise.exerciseId}
                      onChange={(e) => handleExerciseChange(index, 'exerciseId', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value={0}>Select exercise</option>
                      {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.category})
                        </option>
                      ))}
                    </select>
                    {exercise.exerciseId === 0 && (
                      <div className="mt-1 text-xs text-red-600">
                        Please select an exercise
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600">Sets</label>
                    <Input
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600">Reps</label>
                    <Input
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600">Weight (kg)</label>
                    <Input
                      type="text"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-xs text-gray-600">Notes</label>
                  <Input
                    type="text"
                    value={exercise.notes}
                    onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                    className="mt-1"
                    placeholder="Optional notes..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" onClick={onClose} variant="danger">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Template'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 