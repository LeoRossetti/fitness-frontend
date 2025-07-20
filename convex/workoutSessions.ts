import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get workout sessions by user
export const getWorkoutSessionsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get workout sessions by client
export const getWorkoutSessionsByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .order("desc")
      .collect();
  },
});

// Get workout sessions by date range
export const getWorkoutSessionsByDateRange = query({
  args: { 
    userId: v.id("users"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, { userId, startDate, endDate }) => {
    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .collect();
  },
});

// Create a new workout session
export const createWorkoutSession = mutation({
  args: {
    userId: v.id("users"),
    clientId: v.optional(v.id("clients")),
    templateId: v.optional(v.id("workoutTemplates")),
    name: v.string(),
    date: v.number(),
    duration: v.optional(v.number()),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("workoutSessions", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update workout session
export const updateWorkoutSession = mutation({
  args: {
    id: v.id("workoutSessions"),
    name: v.optional(v.string()),
    duration: v.optional(v.number()),
    exercises: v.optional(v.array(v.object({
      name: v.string(),
      sets: v.array(v.object({
        reps: v.number(),
        weight: v.optional(v.number()),
        completed: v.boolean(),
      })),
    }))),
    notes: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    return await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Delete workout session
export const deleteWorkoutSession = mutation({
  args: { id: v.id("workoutSessions") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
