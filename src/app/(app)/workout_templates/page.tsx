"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2 } from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  exerciseCount: number;
  createdAt: string;
}

export default function WorkoutTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Временные данные для демонстрации

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workout Templates</h1>
            <p className="text-gray-500">Manage your saved workout templates</p>
          </div>
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => {/* TODO: Implement template creation */}}
          >
            <span className="text-lg">+</span>
            Create New Template
          </button>
        </div>

        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-violet-500 focus:ring-violet-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
} 