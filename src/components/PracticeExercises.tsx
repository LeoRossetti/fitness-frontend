"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export function PracticeExercises() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  // Get all users for the dropdown
  const users = useQuery(api.users.getAllUsers);
  
  // Get clients for the selected user
  const clients = useQuery(
    api.clients.getClientsByUser,
    selectedUserId ? { userId: selectedUserId as any } : "skip"
  );
  
  // Mutation to create a client
  const createClient = useMutation(api.clients.createClient);

  const handleCreateClient = async () => {
    if (!selectedUserId || !clientName) {
      Sentry.captureMessage("User tried to create client without required fields", "warning");
      alert("Please select a user and enter client name");
      return;
    }

    try {
      await createClient({
        userId: selectedUserId as any,
        name: clientName,
        email: clientEmail || undefined,
      });
      
      // Clear form
      setClientName("");
      setClientEmail("");
      
      Sentry.captureMessage("Client created successfully", "info");
      alert("Client created successfully!");
    } catch (error) {
      console.error("Error creating client:", error);
      Sentry.captureException(error);
      alert("Error creating client. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🏋️ Practice: Client Management</h2>
      
      {/* Instructions */}
      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Practice Goal</h3>
        <p className="text-blue-800">
          Learn how to work with related data in Convex. First create a user, then create clients for that user.
          This demonstrates one-to-many relationships in your database.
        </p>
      </div>

      {/* Create Client Form */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Add Client to User</h3>
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
              Client Name *
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email (Optional)
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john.smith@example.com"
            />
          </div>
          
          <button
            onClick={handleCreateClient}
            disabled={!selectedUserId || !clientName}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Client
          </button>
        </div>
      </div>

      {/* Display Clients for Selected User */}
      {selectedUserId && (
        <div className="border rounded-lg">
          <h3 className="text-lg font-semibold p-4 border-b bg-gray-50">
            Clients for Selected User
          </h3>
          <div className="p-4">
            {clients === undefined ? (
              <p className="text-gray-500">Loading clients...</p>
            ) : clients.length === 0 ? (
              <p className="text-gray-500">No clients found for this user. Add one above!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {clients.map((client) => (
                  <div key={client._id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <h4 className="font-semibold text-lg">{client.name}</h4>
                    {client.email && (
                      <p className="text-sm text-gray-600">{client.email}</p>
                    )}
                    {client.phone && (
                      <p className="text-sm text-gray-600">📞 {client.phone}</p>
                    )}
                    {client.goals && (
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>Goals:</strong> {client.goals}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Added: {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Practice Tips */}
      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">💡 Practice Tips</h3>
        <ul className="text-yellow-800 space-y-2">
          <li>• Try creating multiple clients for the same user to see the one-to-many relationship</li>
          <li>• Check the Convex dashboard to see the data being created in real-time</li>
          <li>• Open browser DevTools Network tab to see the Convex API calls</li>
          <li>• Try triggering an error by creating a client without selecting a user</li>
          <li>• Check your Sentry dashboard to see error tracking in action</li>
        </ul>
      </div>
    </div>
  );
}
