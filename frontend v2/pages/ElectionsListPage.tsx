import React, { useState, useContext, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ElectionContext } from "../contexts/ElectionContext";
import { SiteContext } from "../contexts/SiteContext";
import { Election, ElectionStatus } from "../types";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContextNew";
import CreateElectionBox from "@/components/Election component/CreateElectionBox";
import ElectionCard from "@/components/Election component/ElectionCard";
import JoinElectionBox from "@/components/Election component/JoinElectionBox"; // ✅ import JoinElectionBox
import LoadingScreen from "@/components/ui/LoadingScreen";

const ElectionsListPage: React.FC = () => {
  const { setElections } = useContext(ElectionContext);
  const { currentOrganization } = useContext(SiteContext);
  const { user } = useAuth();

  const [error, setError] = useState("");
  const [createdElections, setCreatedElections] = useState<Election[]>([]);
  const [joinedElections, setJoinedElections] = useState<Election[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [showJoinBox, setShowJoinBox] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch Created & Joined Elections ----------------
  useEffect(() => {
    if (!user || user === "pending") return;

    const fetchElections = async () => {
      try {
        const [createdRes, joinedRes] = await Promise.all([
          axiosInstance.get(`/vote/created/${user.id}`), // ✅ relative URL
          axiosInstance.get(`/vote/joined/${user.id}`),
        ]);
        setCreatedElections(createdRes.data);
        setJoinedElections(joinedRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch elections");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [user.id]);

  const toggleStatusFilter = (status: string) => {
    const newSet = new Set(statusFilters);
    if (newSet.has(status)) newSet.delete(status);
    else newSet.add(status);
    setStatusFilters(newSet);
  };

  const filterElections = (elections: Election[]) => {
    return elections.filter((e) => {
      const matchesSearch = e.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilters.size === 0 || statusFilters.has(e.status);
      return matchesSearch && matchesStatus;
    });
  };

  const handleCreateElection = (data: {
    name: string;
    description: string;
    candidates: string[];
    startDate: string;
    endDate: string;
  }) => {
    const newElection: Election = {
      id: `${Date.now()}`,
      name: data.name,
      description: data.description,
      organization: currentOrganization,
      status: ElectionStatus.Active,
      startDate: data.startDate,
      endDate: data.endDate,
      isDemo: false,
      voters: [],
      votes: [],
      candidates: data.candidates.map((name, index) => ({
        candidate_id: `${Date.now()}-${index}`,
        full_name: name,
        photo_url: "",
        short_bio: "",
        party: "",
      })),
    };

    setCreatedElections((prev) => [newElection, ...prev]);
    setShowCreateBox(false);
  };

  const handleJoinElection = async (electionId: string) => {
    try {
      // Call API to join the election
      await axiosInstance.post(`http://localhost:3000/vote/join`, {
        electionId,
        userId: user.id,
      });

      // Optionally, refetch joined elections
      const joinedRes = await axiosInstance.get(
        `http://localhost:3000/vote/joined/${user.id}`,
      );
      setJoinedElections(joinedRes.data);

      setShowJoinBox(false);
    } catch (err) {
      console.error(err);
      alert("Failed to join election. Please check the Election ID.");
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Elections..." />;
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        } flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2
            className={`text-lg font-bold text-indigo-900 ${
              sidebarOpen ? "block" : "hidden"
            }`}>
            Elections
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-indigo-900 focus:outline-none">
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="flex-1 flex flex-col p-4 space-y-2">
          <Button
            className="w-full"
            variant="primary"
            onClick={() => setShowCreateBox(true)}>
            {sidebarOpen ? "Create Election" : "C"}
          </Button>

          {/* Join Election Button */}
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setShowJoinBox(true)}>
            {sidebarOpen ? "Join Election" : "J"}
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 relative">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-900">
            E-Voting Portal
          </h1>
          <p className="text-lg text-slate-600 mt-1">
            Browse and participate in elections for{" "}
            <span className="font-semibold">{currentOrganization}</span>.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex gap-4 items-center flex-wrap">
              {Object.values(ElectionStatus).map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={statusFilters.has(status)}
                    onChange={() => toggleStatusFilter(status)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Created Elections */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
            Created Elections
          </h2>
          {filterElections(createdElections).length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filterElections(createdElections).map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No created elections found.</p>
          )}
        </div>

        {/* Joined Elections */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
            Joined Elections
          </h2>
          {filterElections(joinedElections).length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filterElections(joinedElections).map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No joined elections found.</p>
          )}
        </div>

        {/* Create Election Modal */}
        {showCreateBox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <CreateElectionBox
              onCancel={() => setShowCreateBox(false)}
              onCreate={handleCreateElection}
            />
          </div>
        )}

        {/* Join Election Modal */}
        {showJoinBox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <JoinElectionBox
              onCancel={() => setShowJoinBox(false)}
              onSubmit={handleJoinElection}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionsListPage;
