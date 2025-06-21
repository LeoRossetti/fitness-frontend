"use client";

import { ServerWorkoutTemplate } from '@/types/types';
import { Edit, Trash2, Dumbbell, Heart, User, Activity } from 'lucide-react';

interface WorkoutTemplateCardProps {
  template: ServerWorkoutTemplate;
  onEdit: (templateId: number) => void;
  onDelete: (templateId: number) => void;
}

export default function WorkoutTemplateCard({ template, onEdit, onDelete }: WorkoutTemplateCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardio':
        return <Heart className="w-4 h-4" />;
      case 'bodyweight':
        return <User className="w-4 h-4" />;
      case 'flexibility':
        return <Activity className="w-4 h-4" />;
      case 'strength':
        return <Dumbbell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Strength':
        return 'bg-[#8B5CF6] text-white';
      case 'Cardio':
        return 'bg-[#10B981] text-white';
      case 'Flexibility':
        return 'bg-[#F59E0B] text-white';
      case 'Bodyweight':
        return 'bg-[#F97316] text-white';
      case 'Balance':
        return 'bg-[#3B82F6] text-white';
      case 'Core':
        return 'bg-[#EC4899] text-white';
      default:
        return 'bg-gray-200 text-[#1F2A44]';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-[#1F2A44]">{template.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">
            {template.Exercises.length} exercises
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(template.id)}
              className="flex items-center gap-1 border border-gray-300 text-[#1F2A44] px-2 py-1 cursor-pointer rounded hover:border-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span className="text-sm">Edit</span>
            </button>
            <button
              onClick={() => onDelete(template.id)}
              className="border border-gray-300 text-[#EF4444] p-1 cursor-pointer rounded hover:border-[#EF4444] hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {template.Exercises.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {Array.from(new Set(template.Exercises.map(ex => ex.Exercise.category))).map(category => (
              <span key={category} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getCategoryColor(category)}`}>
                {getCategoryIcon(category)}
                {category}
              </span>
            ))}
          </div>
          <div className="space-y-1">
            {template.Exercises.slice(0, 3).map((exercise, index) => (
              <div key={index} className="text-xs text-[#6B7280] flex justify-between">
                <span>{exercise.Exercise.name}</span>
                <span>{exercise.sets}×{exercise.reps}</span>
              </div>
            ))}
            {template.Exercises.length > 3 && (
              <div className="text-xs text-[#6B7280] italic">
                +{template.Exercises.length - 3} more exercises
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-[#6B7280]">
        Created: {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'Unknown date'}
      </div>
    </div>
  );
} 