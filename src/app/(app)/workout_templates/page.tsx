"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Dumbbell, Calendar, Target, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getWorkoutTemplates } from '@/lib/api';
import toast from 'react-hot-toast';
import { ServerWorkoutTemplate } from '@/types/types';

export default function WorkoutTemplatesPage() {
  const [templates, setTemplates] = useState<ServerWorkoutTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ServerWorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Strength' | 'Cardio' | 'Flexibility' | 'Bodyweight'>('All');

  const fetchTemplates = async () => {
    try {
      const data = await getWorkoutTemplates();
      // Сервер возвращает объект с полем templates
      const templatesArray = data.templates || [];
      setTemplates(templatesArray);
      setFilteredTemplates(templatesArray);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
      setTemplates([]);
      setFilteredTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const applyFilters = (query: string, filterType: typeof filter) => {
    let result = templates;

    if (query) {
      result = result.filter(template =>
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.Exercises.some(ex => 
          ex.Exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          ex.Exercise.category.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (filterType !== 'All') {
      result = result.filter(template => 
        template.Exercises.some(ex => ex.Exercise.category === filterType)
      );
    }

    setFilteredTemplates(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, filter);
  };

  const handleFilterChange = (filterType: typeof filter) => {
    setFilter(filterType);
    applyFilters(searchQuery, filterType);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilter('All');
    applyFilters('', 'All');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  const templatesToRender = Array.isArray(filteredTemplates) ? filteredTemplates : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44] mb-2">Workout Templates</h1>
            <p className="text-sm text-[#6B7280]">Manage your saved workout templates</p>
          </div>
          <Button
            type="button"
            className="flex items-center gap-2 cursor-pointer"
            variant="success"
            onClick={() => {/* TODO: Navigate to workout builder */}}
          >
            <Plus className="h-5 w-5" />
            Create New Template
          </Button>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
          </div>

          <div className="flex gap-2">
            {(['All', 'Strength', 'Cardio', 'Flexibility', 'Bodyweight'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  filter === type
                    ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]'
                    : 'bg-gray-200 text-[#1F2A44] hover:bg-gray-300'
                }`}
              >
                {type === 'All' && <Dumbbell className="h-5 w-5" />}
                {type === 'Strength' && <Dumbbell className="h-5 w-5" />}
                {type === 'Cardio' && <Calendar className="h-5 w-5" />}
                {type === 'Flexibility' && <Target className="h-5 w-5" />}
                {type === 'Bodyweight' && <Dumbbell className="h-5 w-5" />}
                {type}
              </button>
            ))}
            <button
              onClick={handleResetFilters}
              className="p-2 bg-gray-200 text-[#1F2A44] rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Список шаблонов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesToRender.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#1F2A44]">{template.name}</h3>
                <span className="text-xs text-[#6B7280]">
                  {template.Exercises.length} exercises
                </span>
              </div>
              
              {template.Exercises.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {Array.from(new Set(template.Exercises.map(ex => ex.Exercise.category))).map(category => (
                      <span key={category} className={`text-xs px-2 py-1 rounded-full ${
                        category === 'Strength' ? 'bg-[#8B5CF6] text-white' :
                        category === 'Cardio' ? 'bg-[#10B981] text-white' :
                        category === 'Bodyweight' ? 'bg-[#F59E0B] text-white' :
                        'bg-gray-200 text-[#1F2A44]'
                      }`}>
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
          ))}
        </div>

        {templatesToRender.length === 0 && !loading && (
          <div className="text-center py-12">
            <Dumbbell className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1F2A44] mb-2">No templates found</h3>
            <p className="text-[#6B7280]">Create your first workout template to get started</p>
          </div>
        )}
      </div>
    </main>
  );
} 