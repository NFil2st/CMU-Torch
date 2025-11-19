import { jest } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";
import { createMockResponse } from "../utils/mockResponse.js";

const supabaseFromMock = jest.fn();
const jwtVerifyMock = jest.fn();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const supabaseModulePath = path.resolve(__dirname, "../../config/supabase.js");

jest.unstable_mockModule(supabaseModulePath, () => ({
  supabase: {
    from: supabaseFromMock
  }
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jwtVerifyMock
  }
}));

let moodController;
beforeAll(async () => {
  moodController = await import("../../controllers/moodController.js");
});

const mockReq = ({ body = {}, headers = {} } = {}) => ({
  body,
  headers
});

const buildSelectUserChain = (user, error = null) => {
  const single = jest.fn().mockResolvedValue({ data: user, error });
  const eq = jest.fn(() => ({ single }));
  const select = jest.fn(() => ({ eq }));
  return { select, single, eq };
};

const buildUpdateChain = (error = null) => {
  const eq = jest.fn().mockResolvedValue({ error });
  const update = jest.fn(() => ({ eq }));
  return { update, eq };
};

beforeEach(() => {
  supabaseFromMock.mockReset();
  jwtVerifyMock.mockReset().mockReturnValue({ username: "mood-user" });
});

describe("Mood Controller - updateMood", () => {
  test("M1 missing Authorization header returns 401", async () => {
    const res = createMockResponse();
    await moodController.updateMood(mockReq({ body: { moodValue: 1 } }), res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("M2 invalid JWT results in 401", async () => {
    jwtVerifyMock.mockImplementation(() => {
      throw new Error("invalid token");
    });
    const res = createMockResponse();

    await moodController.updateMood(
      mockReq({
        headers: { authorization: "Bearer bad" },
        body: { moodValue: 1 }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("M3 returns 404 when user not found in Supabase", async () => {
    supabaseFromMock.mockImplementationOnce(() =>
      buildSelectUserChain(null, { message: "Not found" })
    );
    const res = createMockResponse();

    await moodController.updateMood(
      mockReq({
        headers: { authorization: "Bearer ok" },
        body: { moodValue: 2 }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("M4 resets todayMoods when lastMoodDate differs from today", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-01-20T00:00:00Z"));
    const staleHistory = { "2024-01-20": [0, 1] };
    const user = {
      username: "mood-user",
      todayMoods: [0, 1],
      dailyMoodHistory: staleHistory,
      lastMoodDate: "2024-01-19"
    };
    const selectChain = buildSelectUserChain(user);
    const updateChain = buildUpdateChain(null);

    supabaseFromMock
      .mockImplementationOnce(() => selectChain)
      .mockImplementationOnce(() => updateChain);

    const res = createMockResponse();
    await moodController.updateMood(
      mockReq({
        headers: { authorization: "Bearer token" },
        body: { moodValue: 5 }
      }),
      res
    );

    const updatePayload = updateChain.update.mock.calls[0][0];
    expect(updatePayload.todayMoods).toEqual([5]);
    jest.useRealTimers();
  });

  test("M5 appends mood when already logged today", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-02-02T00:00:00Z"));
    const user = {
      username: "mood-user",
      todayMoods: [1, 2],
      dailyMoodHistory: { "2024-02-02": [1, 2] },
      lastMoodDate: "2024-02-02"
    };
    const selectChain = buildSelectUserChain(user);
    const updateChain = buildUpdateChain(null);
    supabaseFromMock
      .mockImplementationOnce(() => selectChain)
      .mockImplementationOnce(() => updateChain);

    await moodController.updateMood(
      mockReq({
        headers: { authorization: "Bearer token" },
        body: { moodValue: 3 }
      }),
      createMockResponse()
    );

    const updatePayload = updateChain.update.mock.calls[0][0];
    expect(updatePayload.todayMoods).toEqual([1, 2, 3]);
    jest.useRealTimers();
  });

  test("M6 stores average of todayMoods", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-03-01T00:00:00Z"));
    const user = {
      username: "mood-user",
      todayMoods: [0, 3],
      dailyMoodHistory: { "2024-03-01": [0, 3] },
      lastMoodDate: "2024-03-01"
    };
    const selectChain = buildSelectUserChain(user);
    const updateChain = buildUpdateChain(null);
    supabaseFromMock
      .mockImplementationOnce(() => selectChain)
      .mockImplementationOnce(() => updateChain);

    const res = createMockResponse();
    await moodController.updateMood(
      mockReq({
        headers: { authorization: "Bearer token" },
        body: { moodValue: 5 }
      }),
      res
    );

    const updatePayload = updateChain.update.mock.calls[0][0];
    expect(updatePayload.mood).toBeCloseTo(8 / 3, 5);
    jest.useRealTimers();
  });

  test("M7 returns successful payload when update succeeds", async () => {
    const user = {
      username: "mood-user",
      todayMoods: [],
      dailyMoodHistory: {},
      lastMoodDate: "2024-01-01"
    };
    const selectChain = buildSelectUserChain(user);
    const updateChain = buildUpdateChain(null);

    supabaseFromMock
      .mockImplementationOnce(() => selectChain)
      .mockImplementationOnce(() => updateChain);

    const res = createMockResponse();
    await moodController.updateMood(
      mockReq({
        headers: { authorization: "Bearer token" },
        body: { moodValue: 4 }
      }),
      res
    );

    expect(res.body.success).toBe(true);
    expect(res.body.todayMoods).toContain(4);
  });
});
