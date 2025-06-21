"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Dumbbell, Heart, User, Activity, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getWorkoutTemplates, deleteWorkoutTemplate } from '@/lib/api';
import WorkoutTemplateCard from '@/components/workouts/WorkoutTemplateCard';
import EditWorkoutTemplateModal from '@/components/workouts/EditWorkoutTemplateModal';
import toast from 'react-hot-toast';
import { ServerWorkoutTemplate } from '@/types/types';

export default function WorkoutTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ServerWorkoutTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ServerWorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Strength' | 'Cardio' | 'Flexibility' | 'Bodyweight'>('All');
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);

  const handleCreateNewTemplate = () => {
    router.push('/workouts');
  };

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

  const handleEdit = (templateId: number) => {
    setEditingTemplateId(templateId);
  };

  const handleDelete = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteWorkoutTemplate(templateId);
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      setFilteredTemplates(prev => prev.filter(template => template.id !== templateId));
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleTemplateUpdated = () => {
    fetchTemplates(); // Перезагружаем список после обновления
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  const templatesToRender = Array.isArray(filteredTemplates) ? filteredTemplates : [];

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
            onClick={handleCreateNewTemplate}
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
                {getCategoryIcon(type)}
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
            <WorkoutTemplateCard
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

      {/* Модалка редактирования шаблона */}
      {editingTemplateId !== null && (
        <EditWorkoutTemplateModal
          templateId={editingTemplateId}
          onClose={() => setEditingTemplateId(null)}
          onUpdated={handleTemplateUpdated}
        />
      )}
    </main>
  );
} 