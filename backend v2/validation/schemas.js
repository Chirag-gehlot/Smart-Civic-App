import { z } from "zod";

const e164Phone = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Phone number must be in E.164 format");

const otpCode = z
  .string()
  .trim()
  .regex(/^\d{4,8}$/, "OTP must be a numeric code");

const nonEmptyString = (fieldName, maxLength = 255) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .max(maxLength, `${fieldName} is too long`);

const uuid = (fieldName) =>
  z.string().trim().uuid(`${fieldName} must be a valid UUID`);

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "chatId must be a valid Mongo ObjectId");

const flexibleUserId = (fieldName) =>
  z.union([
    z.string().trim().min(1, `${fieldName} is required`),
    z.number().int().positive(`${fieldName} must be a positive integer`),
  ]);

const dateString = (fieldName) =>
  z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: `${fieldName} must be a valid date`,
    });

const dateRange = (schema) =>
  schema.refine((data) => Date.parse(data.endDate) > Date.parse(data.startDate), {
    path: ["endDate"],
    message: "endDate must be after startDate",
  });

export const signupSendOtpSchema = {
  body: z
    .object({
      full_name: nonEmptyString("full_name", 100),
      phone_number: e164Phone,
    })
    .strip(),
};

export const signupVerifyOtpSchema = {
  body: z
    .object({
      phone_number: e164Phone,
      code: otpCode,
    })
    .strip(),
};

export const loginSendOtpSchema = {
  body: z
    .object({
      phone_number: e164Phone,
    })
    .strip(),
};

export const loginVerifyOtpSchema = signupVerifyOtpSchema;

export const chatQuerySchema = {
  params: z
    .object({
      chatId: objectId,
    })
    .strip(),
  body: z
    .object({
      query: nonEmptyString("query", 4000),
    })
    .strip(),
};

export const chatMessagesSchema = {
  params: z
    .object({
      chatId: objectId,
    })
    .strip(),
};

export const registerVoteSchema = {
  body: z
    .object({
      election_id: uuid("election_id"),
      candidate_id: uuid("candidate_id"),
      voter_id: flexibleUserId("voter_id"),
    })
    .strip(),
};

export const joinElectionSchema = {
  body: z
    .object({
      election_id: uuid("election_id"),
      user_id: flexibleUserId("user_id"),
    })
    .strip(),
};

export const createVotingSchema = {
  body: dateRange(
    z
      .object({
        name: nonEmptyString("name", 150),
        description: nonEmptyString("description", 2000),
        user_created_id: flexibleUserId("user_created_id"),
        candidates: z
          .array(nonEmptyString("candidate name", 150))
          .min(1, "At least one candidate is required"),
        startDate: dateString("startDate"),
        endDate: dateString("endDate"),
      })
      .strip(),
  ),
};

export const electionIdParamsSchema = {
  params: z
    .object({
      id: uuid("id"),
    })
    .strip(),
};

export const userIdParamsSchema = {
  params: z
    .object({
      userId: flexibleUserId("userId"),
    })
    .strip(),
};
