import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all workout templates for a user
export const getWorkoutTemplatesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("workoutTemplates")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Get workout template by ID
export const getWorkoutTemplateById = query({
  args: { id: v.id("workoutTemplates") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Create a new workout template
export const createWorkoutTemplate = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("workoutTemplates", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update workout template
export const updateWorkoutTemplate = mutation({
  args: {
    id: v.id("workoutTemplates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    exercises: v.optional(v.array(v.object({
      name: v.string(),
      sets: v.number(),
      reps: v.number(),
      weight: v.optional(v.number()),
      restTime: v.optional(v.number()),
      notes: v.optional(v.string()),
    }))),
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

// Delete workout template
export const deleteWorkoutTemplate = mutation({
  args: { id: v.id("workoutTemplates") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
