"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
}

export function WorkoutTemplatesPractice() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Current exercise being added
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: "",
    sets: 3,
    reps: 10,
    weight: undefined,
    restTime: 60,
    notes: "",
  });

  // Get all users for the dropdown
  const users = useQuery(api.users.getAllUsers);
  
  // Get workout templates for the selected user
  const templates = useQuery(
    api.workoutTemplates.getWorkoutTemplatesByUser,
    selectedUserId ? { userId: selectedUserId as any } : "skip"
  );
  
  // Mutation to create a workout template
  const createWorkoutTemplate = useMutation(api.workoutTemplates.createWorkoutTemplate);

  const addExercise = () => {
    if (!currentExercise.name) {
      alert("Please enter an exercise name");
      return;
    }

    setExercises([...exercises, { ...currentExercise }]);
    setCurrentExercise({
      name: "",
      sets: 3,
      reps: 10,
      weight: undefined,
      restTime: 60,
      notes: "",
    });
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleCreateTemplate = async () => {
    if (!selectedUserId || !templateName || exercises.length === 0) {
      Sentry.captureMessage("User tried to create workout template without required fields", "warning");
      alert("Please select a user, enter template name, and add at least one exercise");
      return;
    }

    try {
      await createWorkoutTemplate({
        userId: selectedUserId as any,
        name: templateName,
        description: templateDescription || undefined,
        exercises,
      });
      
      // Clear form
      setTemplateName("");
      setTemplateDescription("");
      setExercises([]);
      
      Sentry.captureMessage("Workout template created successfully", "info");
      alert("Workout template created successfully!");
    } catch (error) {
      console.error("Error creating workout template:", error);
      Sentry.captureException(error);
      alert("Error creating workout template. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🏋️ Advanced Practice: Workout Templates</h2>
      
      {/* Instructions */}
      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Practice Goal</h3>
        <p className="text-blue-800">
          Learn to work with complex nested data structures in Convex. Create workout templates with multiple exercises,
          each having their own properties. This demonstrates working with arrays of objects in your database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Template Form */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Create Workout Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User (Trainer)
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a user...</option>
                  {users?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Push Day Workout"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Upper body strength training focused on pushing movements"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Add Exercise Form */}
          <div className="p-4 border rounded-lg bg-green-50">
            <h4 className="font-semibold mb-4">Add Exercise</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name *
                  </label>
                  <input
                    type="text"
                    value={currentExercise.name}
                    onChange={(e) => setCurrentExercise({...currentExercise, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Bench Press"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sets *
                  </label>
                  <input
                    type="number"
                    value={currentExercise.sets}
                    onChange={(e) => setCurrentExercise({...currentExercise, sets: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reps *
                  </label>
                  <input
                    type="number"
                    value={currentExercise.reps}
                    onChange={(e) => setCurrentExercise({...currentExercise, reps: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={currentExercise.weight || ""}
                    onChange={(e) => setCurrentExercise({...currentExercise, weight: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rest (sec)
                  </label>
                  <input
                    type="number"
                    value={currentExercise.restTime || ""}
                    onChange={(e) => setCurrentExercise({...currentExercise, restTime: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    step="15"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={currentExercise.notes || ""}
                  onChange={(e) => setCurrentExercise({...currentExercise, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Focus on controlled movement"
                />
              </div>
              
              <button
                onClick={addExercise}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm"
              >
                Add Exercise to Template
              </button>
            </div>
          </div>

          {/* Current Exercises */}
          {exercises.length > 0 && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-4">Exercises in Template ({exercises.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                    <div>
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-gray-600 ml-2">
                        {exercise.sets} × {exercise.reps}
                        {exercise.weight && ` @ ${exercise.weight}lbs`}
                      </span>
                    </div>
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleCreateTemplate}
            disabled={!selectedUserId || !templateName || exercises.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Create Workout Template
          </button>
        </div>

        {/* Display Templates */}
        <div>
          {selectedUserId && (
            <div className="border rounded-lg">
              <h3 className="text-lg font-semibold p-4 border-b bg-gray-50">
                Workout Templates for Selected User
              </h3>
              <div className="p-4 max-h-96 overflow-y-auto">
                {templates === undefined ? (
                  <p className="text-gray-500">Loading templates...</p>
                ) : templates.length === 0 ? (
                  <p className="text-gray-500">No templates found. Create one!</p>
                ) : (
                  <div className="space-y-4">
                    {templates.map((template: any) => (
                      <div key={template._id} className="p-4 border rounded-lg bg-white shadow-sm">
                        <h4 className="font-bold text-lg">{template.name}</h4>
                        {template.description && (
                          <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                        )}
                        <div className="mt-3">
                          <p className="font-medium text-sm text-gray-700 mb-2">
                            Exercises ({template.exercises.length}):
                          </p>
                          <div className="space-y-1">
                            {template.exercises.map((exercise: any, idx: number) => (
                              <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                                <span className="font-medium">{exercise.name}</span>
                                <span className="text-gray-600 ml-2">
                                  {exercise.sets} × {exercise.reps}
                                  {exercise.weight && ` @ ${exercise.weight}lbs`}
                                  {exercise.restTime && ` | ${exercise.restTime}s rest`}
                                </span>
                                {exercise.notes && (
                                  <div className="text-gray-500 italic mt-1">{exercise.notes}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                          Created: {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Practice Tips */}
      <div className="mt-8 p-4 bg-purple-50 border-l-4 border-purple-400">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">💡 Advanced Practice Tips</h3>
        <ul className="text-purple-800 space-y-2 text-sm">
          <li>• Create complex workout templates with multiple exercises to understand nested data</li>
          <li>• Notice how Convex handles arrays of objects in the schema and mutations</li>
          <li>• Try creating templates with different exercise combinations</li>
          <li>• Observe how the data is structured in the Convex dashboard</li>
          <li>• Practice error handling by trying to create templates without required fields</li>
          <li>• This pattern is common in real applications - master it!</li>
        </ul>
      </div>
    </div>
  );
}
