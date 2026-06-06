import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContextNew";
import axios from "axios";

interface Candidate {
  candidate_id: string;
  full_name: string;
  photo_url?: string;
  short_bio?: string;
  party?: string;
  votes?: number;
}

interface Election {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  is_demo?: boolean;
  candidates?: Candidate[];
}

interface ElectionCardProps {
  election: Election;
  voterId: string; // must be passed from parent (logged-in user ID)
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election, voterId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate!");
      return;
    }

    if (!user?.id) {
      alert("You must be logged in to vote!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        election_id: election.id,
        candidate_id: selectedCandidate,
        voter_id: user.id, // use the user from AuthContext
      };

      console.log("Payload to send:", payload);

      const response = await axios.post(
        "http://localhost:3000/vote/register-vote",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response:", response.data);

      alert(response.data.message || "Vote submitted successfully!");
      setShowModal(false);
      setSelectedCandidate(null);
    } catch (error: any) {
      console.error("Error during vote submission:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to submit vote. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Election Card */}
      <div
        className="bg-white p-4 rounded-xl shadow-md border border-slate-200 cursor-pointer hover:shadow-lg transition"
        onClick={() => setShowModal(true)}>
        <h3 className="text-lg font-semibold text-indigo-900">
          {election.name}
        </h3>
        <p className="text-slate-600 mt-1">{election.description}</p>
        <p className="mt-2 text-sm text-slate-500">
          <strong>Status:</strong> {election.status}
        </p>
        <p className="text-sm text-slate-500">
          <strong>Start:</strong>{" "}
          {new Date(election.start_date).toLocaleString()}
        </p>
        <p className="text-sm text-slate-500">
          <strong>End:</strong> {new Date(election.end_date).toLocaleString()}
        </p>
        {election.is_demo && (
          <p className="text-xs text-orange-500 font-semibold mt-1">
            Demo Election
          </p>
        )}

        {/* Candidate Names */}
        {election.candidates && election.candidates.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-semibold text-slate-700">Candidates:</p>
            <ul className="list-disc list-inside text-sm text-slate-600">
              {election.candidates.map((c) => (
                <li key={c.candidate_id}>{c.full_name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold text-indigo-900 mb-4">
              Vote for a Candidate
            </h2>

            <div className="flex flex-col gap-2 mb-4">
              {election.candidates?.map((c) => (
                <label
                  key={c.candidate_id}
                  className="flex items-center gap-2 text-slate-700">
                  <input
                    type="radio"
                    name="candidate"
                    value={c.candidate_id}
                    checked={selectedCandidate === c.candidate_id}
                    onChange={() => setSelectedCandidate(c.candidate_id)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  {c.full_name} {c.party && `(${c.party})`}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                disabled={loading}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ElectionCard;
