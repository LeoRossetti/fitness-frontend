import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all clients for a user
export const getClientsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Get client by ID
export const getClientById = query({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Create a new client
export const createClient = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    goals: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("clients", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update client
export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    goals: v.optional(v.string()),
    notes: v.optional(v.string()),
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

// Delete client
export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    // Also delete related workout sessions, measurements, goals, and calendar events
    const workoutSessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_client", (q) => q.eq("clientId", id))
      .collect();
    
    const measurements = await ctx.db
      .query("measurements")
      .withIndex("by_client", (q) => q.eq("clientId", id))
      .collect();
    
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_client", (q) => q.eq("clientId", id))
      .collect();
    
    const calendarEvents = await ctx.db
      .query("calendarEvents")
      .withIndex("by_client", (q) => q.eq("clientId", id))
      .collect();

    // Delete all related records
    for (const session of workoutSessions) {
      await ctx.db.delete(session._id);
    }
    for (const measurement of measurements) {
      await ctx.db.delete(measurement._id);
    }
    for (const goal of goals) {
      await ctx.db.delete(goal._id);
    }
    for (const event of calendarEvents) {
      await ctx.db.delete(event._id);
    }

    // Finally delete the client
    return await ctx.db.delete(id);
  },
});
