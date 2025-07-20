"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export function ConvexExample() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  // Query to get all users
  const users = useQuery(api.users.getAllUsers);
  
  // Mutation to create a user
  const createUser = useMutation(api.users.createUser);

  const handleCreateUser = async () => {
    if (!userEmail || !userName) {
      Sentry.captureMessage("User tried to create account without email or name", "warning");
      alert("Please fill in both email and name");
      return;
    }

    setLoading(true);
    try {
      await createUser({
        email: userEmail,
        name: userName,
      });
      
      // Clear form
      setUserEmail("");
      setUserName("");
      
      Sentry.captureMessage("User created successfully", "info");
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      Sentry.captureException(error);
      alert("Error creating user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Example of intentional error for testing Sentry
  const triggerError = () => {
    throw new Error("This is a test error for Sentry!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Convex + Sentry Demo</h2>
      
      {/* Create User Form */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Create New User</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <button
            onClick={handleCreateUser}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>

      {/* Test Sentry Error */}
      <div className="mb-8 p-4 border rounded-lg bg-red-50">
        <h3 className="text-lg font-semibold mb-4 text-red-800">Test Sentry Error Tracking</h3>
        <button
          onClick={triggerError}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Trigger Test Error
        </button>
      </div>

      {/* Display Users */}
      <div className="border rounded-lg">
        <h3 className="text-lg font-semibold p-4 border-b bg-gray-50">All Users</h3>
        <div className="p-4">
          {users === undefined ? (
            <p className="text-gray-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-500">No users found. Create one above!</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user._id} className="p-3 border rounded-md bg-white">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
