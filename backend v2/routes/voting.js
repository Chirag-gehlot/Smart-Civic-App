import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import validateRequest from "../middleware/validateRequest.js";
import {
  createVotingSchema,
  electionIdParamsSchema,
  joinElectionSchema,
  registerVoteSchema,
  userIdParamsSchema,
} from "../validation/schemas.js";

import crypto from "crypto";

const votingRouter = express.Router();
// Helper to hash voter ID

const hashVoterId = (voterId) => {
  return crypto.createHash("sha256").update(voterId).digest("hex");
};

// Register a vote
votingRouter.post(
  "/register-vote",
  validateRequest(registerVoteSchema),
  async (req, res) => {
  const { election_id, candidate_id, voter_id } = req.body;

  try {
    // In your case, voter_hashed_id is just the voter_id
    const voter_hashed_id = voter_id;

    // 1️⃣ Check if voter has already voted in this election
    const { data: existingVotes, error: checkError } = await supabase
      .from("votes")
      .select("*")
      .eq("election_id", election_id)
      .eq("voter_hashed_id", voter_hashed_id);

    if (checkError) throw checkError;

    if (existingVotes && existingVotes.length > 0) {
      return res.status(400).json({ message: "You have already voted." });
    }

    // 2️⃣ Insert vote into votes table
    const tx_hash = uuidv4();
    const timestamp = new Date().toISOString();

    const { data: insertedVote, error: insertError } = await supabase
      .from("votes")
      .insert({
        tx_hash,
        election_id,
        candidate_id,
        voter_hashed_id,
        timestamp,
      });

    if (insertError) throw insertError;

    // 3️⃣ Increment candidate's votes **only for this candidate in this election**
    // Make sure to check candidate belongs to the same election
    const { data: candidateData, error: candidateCheckError } = await supabase
      .from("candidates")
      .select("*")
      .eq("candidate_id", candidate_id)
      .eq("election_id", election_id);

    if (candidateCheckError) throw candidateCheckError;

    if (!candidateData || candidateData.length === 0) {
      return res
        .status(400)
        .json({ message: "Candidate not found for this election." });
    }

    const { error: updateCandidateError } = await supabase
      .from("candidates")
      .update({ votes: candidateData[0].votes + 1 })
      .eq("candidate_id", candidate_id)
      .eq("election_id", election_id);

    if (updateCandidateError) throw updateCandidateError;

    return res.status(201).json({
      message: "Vote registered successfully",
      tx_hash,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to register vote",
      error: error.message || error,
    });
  }
  },
);

// Join an election
votingRouter.post(
  "/join",
  validateRequest(joinElectionSchema),
  async (req, res) => {
  const { election_id, user_id } = req.body;

  try {
    // 1️⃣ Fetch election details
    const { data: election, error: electionError } = await supabase
      .from("elections")
      .select("*")
      .eq("id", election_id)
      .single();

    if (electionError) throw electionError;
    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    // 2️⃣ Check if user created this election
    if (election.user_created_id.toString() === user_id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot join an election you created",
      });
    }

    // 3️⃣ Check if user already joined
    const { data: joined, error: joinedError } = await supabase
      .from("joined_elections")
      .select("*")
      .eq("user_id", user_id)
      .eq("election_id", election_id);

    if (joinedError) throw joinedError;
    if (joined && joined.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already joined this election",
      });
    }

    // 4️⃣ Insert into joined_elections (only IDs, no redundant columns)
    const { data: inserted, error: insertError } = await supabase
      .from("joined_elections")
      .insert({
        id: uuidv4(),
        user_id,
        election_id,
        joined_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;

    // 5️⃣ Fetch the joined election details by joining tables
    const { data: joinedElection, error: fetchError } = await supabase
      .from("joined_elections")
      .select(
        `
        joined_at,
        elections (
          id,
          name,
          description,
          start_date,
          end_date,
          status,
          user_created_id
        )
      `
      )
      .eq("user_id", user_id)
      .eq("election_id", election_id)
      .single();

    if (fetchError) throw fetchError;

    res.status(201).json({
      success: true,
      message: "Successfully joined the election",
      data: {
        id: joinedElection.elections.id,
        name: joinedElection.elections.name,
        description: joinedElection.elections.description,
        startDate: joinedElection.elections.start_date,
        endDate: joinedElection.elections.end_date,
        status: joinedElection.elections.status,
        joinedAt: joinedElection.joined_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to join election",
    });
  }
  },
);

// Create a new election
votingRouter.post(
  "/create-voting",
  validateRequest(createVotingSchema),
  async (req, res) => {
  const {
    name,
    description,
    user_created_id, // <-- updated
    candidates: candidateNames,
    startDate,
    endDate,
  } = req.body;

  const electionId = uuidv4();

  try {
    // Insert election
    const { error: electionError } = await supabase.from("elections").insert({
      id: electionId,
      name,
      description,
      user_created_id, // <-- new column
      start_date: startDate,
      end_date: endDate,
      status: "Active",
      is_demo: false,
    });

    if (electionError) throw electionError;

    // Insert candidates
    const candidateRecords = candidateNames.map((full_name) => ({
      candidate_id: uuidv4(),
      election_id: electionId,
      full_name,
      photo_url: "",
      short_bio: "",
      party: "",
      votes: 0,
    }));

    const { error: candidatesError } = await supabase
      .from("candidates")
      .insert(candidateRecords);

    if (candidatesError) throw candidatesError;

    return res
      .status(201)
      .json({ message: "Election created successfully", electionId });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to create election", error });
  }
  },
);

// Get election by ID
votingRouter.get(
  "/:id",
  validateRequest(electionIdParamsSchema),
  async (req, res) => {
  const electionId = req.params.id;

  try {
    // Fetch election
    const { data: electionData, error: electionError } = await supabase
      .from("elections")
      .select("*")
      .eq("id", electionId)
      .single();

    if (electionError || !electionData)
      return res.status(404).json({ message: "Election not found" });

    // Fetch candidates
    const { data: candidatesData, error: candidatesError } = await supabase
      .from("candidates")
      .select("*")
      .eq("election_id", electionId);

    if (candidatesError) throw candidatesError;

    // Fetch votes
    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("*")
      .eq("election_id", electionId);

    if (votesError) throw votesError;

    return res.json({
      ...electionData,
      candidates: candidatesData,
      votes: votesData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch election", error });
  }
  },
);

// Fetch all elections created by the logged-in user
votingRouter.get(
  "/created/:userId",
  validateRequest(userIdParamsSchema),
  async (req, res) => {
  const userId = req.params.userId;

  try {
    // Select elections along with candidates
    const { data, error } = await supabase
      .from("elections")
      .select(
        `
        *,
        candidates(
          candidate_id,
          full_name,
          photo_url,
          short_bio,
          party,
          votes
        )
      `
      )
      .eq("user_created_id", userId);

    if (error) throw error;

    res.status(200).json(data || []);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch created elections" });
  }
  },
);

// Fetch all elections joined by the logged-in user
votingRouter.get(
  "/joined/:userId",
  validateRequest(userIdParamsSchema),
  async (req, res) => {
  const userId = req.params.userId;

  try {
    const { data, error } = await supabase
      .from("joined_elections")
      .select(
        `
        elections(
          *,
          candidates(
            candidate_id,
            full_name,
            photo_url,
            short_bio,
            party,
            votes
          )
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    // Flatten the elections array from joined_elections
    const elections = data.map((item) => item.elections).filter(Boolean);

    res.status(200).json(elections);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch joined elections" });
  }
  },
);

export default votingRouter;
