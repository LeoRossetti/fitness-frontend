import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all users
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

// Create a new user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, { email, name, image }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    return await ctx.db.insert("users", {
      email,
      name,
      image,
      createdAt: Date.now(),
    });
  },
});

// Update user
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, { id, name, image }) => {
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (image !== undefined) updates.image = image;

    return await ctx.db.patch(id, updates);
  },
});

// Delete user
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
