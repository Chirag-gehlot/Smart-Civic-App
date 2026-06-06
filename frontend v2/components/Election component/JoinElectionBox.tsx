import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import { useAuth } from "@/contexts/AuthContextNew";

interface JoinElectionBoxProps {
  onCancel: () => void;
  onSubmit?: (electionId: string) => void; // optional, we handle API directly
}

const JoinElectionBox: React.FC<JoinElectionBoxProps> = ({ onCancel }) => {
  const [electionId, setElectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!electionId.trim()) {
      alert("Please enter a valid Election ID");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/vote/join", {
        election_id: electionId.trim(),
        user_id: user.id,
      });

      if (response.data.success) {
        alert(response.data.message);
        onCancel(); // close modal after successful join
      } else {
        alert(response.data.message || "Failed to join election");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to join election. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-full">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">Join Election</h2>
      <input
        type="text"
        placeholder="Enter Election ID"
        value={electionId}
        onChange={(e) => setElectionId(e.target.value)}
        className="w-full border-slate-300 rounded-md shadow-sm p-2 mb-4 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Joining..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default JoinElectionBox;
