import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import { useAuth } from "../../contexts/AuthContextNew";

interface CreateElectionBoxProps {
  onCreate: (data: {
    name: string;
    description: string;
    candidates: string[];
    startDate: string;
    endDate: string;
  }) => void;
  onCancel: () => void;
}

const CreateElectionBox: React.FC<CreateElectionBoxProps> = ({
  onCreate,
  onCancel,
}) => {
  const { user } = useAuth(); // ✅ get logged-in user
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [candidates, setCandidates] = useState<string[]>([""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdElectionId, setCreatedElectionId] = useState<string | null>(
    null
  );

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, ""]);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    const filteredCandidates = candidates.filter((c) => c.trim() !== "");

    if (!user) {
      alert("You must be logged in to create an election.");
      return;
    }

    if (
      !name ||
      !description ||
      filteredCandidates.length === 0 ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/vote/create-voting",
        {
          name,
          description,
          user_created_id: user.id, // ✅ use id from AuthContext
          candidates: filteredCandidates,
          startDate,
          endDate,
        }
      );

      const { electionId } = response.data;
      setCreatedElectionId(electionId);

      // Optionally update parent state
      onCreate({
        name,
        description,
        candidates: filteredCandidates,
        startDate,
        endDate,
      });
    } catch (error: any) {
      console.error(error);
      alert(
        `Failed to create election: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const copyToClipboard = () => {
    if (createdElectionId) {
      navigator.clipboard.writeText(createdElectionId);
      alert("Election ID copied to clipboard!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-indigo-900 mb-4">
        Create Election
      </h2>

      {/* Election Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700">
          Election Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Candidates */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700">
          Candidates
        </label>
        <div className="space-y-2 mt-1">
          {candidates.map((candidate, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={candidate}
                onChange={(e) => handleCandidateChange(index, e.target.value)}
                placeholder={`Candidate ${index + 1}`}
                className="flex-1 border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {candidates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  className="text-red-500 font-bold text-xl">
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCandidate}
          className="mt-2 text-indigo-600 font-medium text-sm">
          + Add Candidate
        </button>
      </div>

      {/* Dates */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Start Date
          </label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            End Date
          </label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Created Election ID */}
      {createdElectionId && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700 mb-2">
            Election created successfully! Share this ID:
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono">{createdElectionId}</span>
            <button
              onClick={copyToClipboard}
              className="text-indigo-600 font-medium text-sm">
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleCreate}>Create</Button>
      </div>
    </div>
  );
};

export default CreateElectionBox;
