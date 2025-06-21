"use client";

import { useEffect, useState } from "react";
import { getExercises } from "@/lib/api";
import { Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateExerciseModal from "./CreateExerciseModal";

interface Exercise {
  id: number;
  name: string;
  category: string;
  muscleGroup: string;
}

interface ExerciseLibraryProps {
  onSelectExercise: (exercise: Exercise) => void;
}

const categories = ["All", "Strength", "Cardio", "Flexibility", "Balance", "Core"];

export default function ExerciseLibrary({ onSelectExercise }: ExerciseLibraryProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchExercises = async () => {
    try {
      const data = await getExercises();
      
      // Сервер возвращает объект с полем exercises
      const exercisesArray = data.exercises || [];
      
      if (Array.isArray(exercisesArray)) {
        setExercises(exercisesArray);
        setFilteredExercises(exercisesArray);
      } else {
        console.error('Expected array but got:', typeof exercisesArray, exercisesArray);
        setError('Invalid data format received from server');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const applyFilters = (query: string, category: string) => {
    let result = exercises;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(ex =>
        ex.name.toLowerCase().includes(lowerQuery) ||
        ex.muscleGroup.toLowerCase().includes(lowerQuery)
      );
    }

    if (category !== 'All') {
      result = result.filter(ex => ex.category === category);
    }

    setFilteredExercises(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, activeCategory);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    applyFilters(searchQuery, category);
  };

  const handleExerciseCreated = () => {
    fetchExercises(); // Перезагружаем список упражнений
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 w-[350px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Exercise Library</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New Exercise
          </Button>
        </div>
        
        {/* Search input */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {Array.isArray(filteredExercises) && filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">{ex.name}</div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      ex.category === 'Strength' ? 'bg-violet-100 text-violet-700' :
                      ex.category === 'Cardio' ? 'bg-blue-100 text-blue-700' :
                      ex.category === 'Flexibility' ? 'bg-green-100 text-green-700' :
                      ex.category === 'Balance' ? 'bg-yellow-100 text-yellow-700' :
                      ex.category === 'Core' ? 'bg-pink-100 text-pink-700' :
                      'bg-gray-100 text-gray-700'}
                    `}>
                      {ex.category}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {ex.muscleGroup}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectExercise(ex)}
                  className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Add to plan"
                >
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateExerciseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onExerciseCreated={handleExerciseCreated}
      />
    </>
  );
}
