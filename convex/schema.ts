import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Clients table for fitness trainers
  clients: defineTable({
    userId: v.id("users"), // Trainer's user ID
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    goals: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Workout templates
  workoutTemplates: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    exercises: v.array(v.object({
      name: v.string(),
      sets: v.number(),
      reps: v.number(),
      weight: v.optional(v.number()),
      restTime: v.optional(v.number()),
      notes: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Individual workout sessions
  workoutSessions: defineTable({
    userId: v.id("users"),
    clientId: v.optional(v.id("clients")),
    templateId: v.optional(v.id("workoutTemplates")),
    name: v.string(),
    date: v.number(),
    duration: v.optional(v.number()), // in minutes
    exercises: v.array(v.object({
      name: v.string(),
      sets: v.array(v.object({
        reps: v.number(),
        weight: v.optional(v.number()),
        completed: v.boolean(),
      })),
    })),
    notes: v.optional(v.string()),
    completed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_date", ["date"]),

  // Exercise library
  exercises: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    muscleGroups: v.array(v.string()),
    equipment: v.optional(v.string()),
    instructions: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_category", ["category"]),

  // Progress measurements
  measurements: defineTable({
    userId: v.id("users"),
    clientId: v.optional(v.id("clients")),
    type: v.string(), // weight, body_fat, muscle_mass, etc.
    value: v.number(),
    unit: v.string(), // kg, lbs, %, etc.
    date: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_type", ["type"]),

  // Goals tracking
  goals: defineTable({
    userId: v.id("users"),
    clientId: v.optional(v.id("clients")),
    title: v.string(),
    description: v.optional(v.string()),
    targetValue: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    targetDate: v.optional(v.number()),
    status: v.string(), // active, completed, paused, cancelled
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),

  // Calendar events/sessions
  calendarEvents: defineTable({
    userId: v.id("users"),
    clientId: v.optional(v.id("clients")),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    type: v.string(), // workout, consultation, assessment, etc.
    status: v.string(), // scheduled, completed, cancelled, no_show
    recurring: v.optional(v.object({
      frequency: v.string(), // daily, weekly, monthly
      interval: v.number(),
      endDate: v.optional(v.number()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_date", ["startTime"]),
});
