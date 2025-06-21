"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { createExercise } from "@/lib/api";
import toast from "react-hot-toast";

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExerciseCreated: () => void;
}

const categories = ["Strength", "Cardio", "Flexibility", "Balance", "Core"];
const muscleGroups = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms",
  "Abs", "Obliques", "Lower Back", "Glutes", "Quadriceps", 
  "Hamstrings", "Calves", "Full Body", "Core"
];

export default function CreateExerciseModal({ 
  isOpen, 
  onClose, 
  onExerciseCreated 
}: CreateExerciseModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Strength",
    muscleGroup: "Chest"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Exercise name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Exercise description is required");
      return;
    }

    setLoading(true);
    
    try {
      await createExercise(formData);
      toast.success("Exercise created successfully!");
      setFormData({
        name: "",
        description: "",
        category: "Strength",
        muscleGroup: "Chest"
      });
      onExerciseCreated();
      onClose();
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error("Failed to create exercise");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Exercise">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Exercise Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g. Push-ups, Squats, Deadlift"
            className="bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe how to perform this exercise..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500 bg-gray-50 resize-none"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500 bg-gray-50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Muscle Group
          </label>
          <select
            value={formData.muscleGroup}
            onChange={(e) => handleInputChange("muscleGroup", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500 bg-gray-50"
          >
            {muscleGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="danger"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-violet-600 hover:bg-violet-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Exercise"}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 