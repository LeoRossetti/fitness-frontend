"use client";

import { ConvexExample } from "@/components/ConvexExample";
import { PracticeExercises } from "@/components/PracticeExercises";
import { WorkoutTemplatesPractice } from "@/components/WorkoutTemplatesPractice";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧪 Convex & Sentry Test Lab
          </h1>
          <p className="text-lg text-gray-600">
            Practice database operations and error monitoring
          </p>
        </div>
        
        {/* Basic Convex Example */}
        <div className="bg-white rounded-lg shadow-lg">
          <ConvexExample />
        </div>
        
        {/* Practice Exercises - Client Management */}
        <div className="bg-white rounded-lg shadow-lg">
          <PracticeExercises />
        </div>
        
        {/* Advanced Practice - Workout Templates */}
        <div className="bg-white rounded-lg shadow-lg">
          <WorkoutTemplatesPractice />
        </div>
      </div>
    </div>
  );
}
