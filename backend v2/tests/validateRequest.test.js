import test from "node:test";
import assert from "node:assert/strict";

import validateRequest from "../middleware/validateRequest.js";
import {
  chatQuerySchema,
  loginSendOtpSchema,
} from "../validation/schemas.js";

function createResponseDouble() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("validateRequest sanitizes valid request data and calls next", () => {
  const middleware = validateRequest(chatQuerySchema);
  const req = {
    params: { chatId: "507f1f77bcf86cd799439011", extra: "ignore-me" },
    body: { query: "   What are tenant rights?   ", extra: "ignore-me" },
    query: {},
  };
  const res = createResponseDouble();
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.params, { chatId: "507f1f77bcf86cd799439011" });
  assert.deepEqual(req.body, { query: "What are tenant rights?" });
  assert.equal(res.body, null);
});

test("validateRequest returns 400 for invalid request data", () => {
  const middleware = validateRequest(loginSendOtpSchema);
  const req = {
    body: { phone_number: "9876543210" },
    params: {},
    query: {},
  };
  const res = createResponseDouble();
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Validation failed",
    errors: [
      {
        field: "phone_number",
        message: "Phone number must be in E.164 format",
      },
    ],
  });
});
