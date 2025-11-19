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

let exerciseController;
beforeAll(async () => {
  exerciseController = await import("../../controllers/exerciseController.js");
});

const mockReq = ({ body = {}, headers = {}, query = {} } = {}) => ({
  body,
  headers,
  query
});

const buildUserSelectChain = (user, error = null) => {
  const single = jest.fn().mockResolvedValue({ data: user, error });
  const eq = jest.fn(() => ({ single }));
  const select = jest.fn(() => ({ eq }));
  return { select, eq, single };
};

const buildUserUpdateChain = error => {
  const eq = jest.fn().mockResolvedValue({ error });
  const update = jest.fn(() => ({ eq }));
  return { update, eq };
};

const buildSportsListChain = (data, error = null) => ({
  select: jest.fn().mockResolvedValue({ data, error })
});

const buildSportsQueryChain = (data, error = null) => {
  const eq = jest.fn().mockResolvedValue({ data, error });
  const select = jest.fn(() => ({ eq }));
  return { select, eq };
};

beforeEach(() => {
  supabaseFromMock.mockReset();
  jwtVerifyMock.mockReset().mockReturnValue({ username: "exercise-user" });
});

describe("Exercise Controller - completeExercise", () => {
  test("E1-1 missing auth header returns 401 with message", async () => {
    const res = createMockResponse();
    await exerciseController.completeExercise(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.body.message).toBe("Token missing or malformed");
  });

  test("E1-2 invalid JWT returns 401", async () => {
    jwtVerifyMock.mockImplementation(() => {
      throw new Error("invalid");
    });
    const res = createMockResponse();

    await exerciseController.completeExercise(
      mockReq({
        headers: { authorization: "Bearer bad" }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("E1-3 user not found returns 404", async () => {
    supabaseFromMock.mockImplementationOnce(() =>
      buildUserSelectChain(null, { message: "not found" })
    );
    const res = createMockResponse();

    await exerciseController.completeExercise(
      mockReq({
        headers: { authorization: "Bearer token" }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("E1-4 first exercise of day creates new log and increments count", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-05-01T00:00:00Z"));
    const user = { stackExercise: undefined, lastExerciseDate: "2024-04-30" };
    const selectChain = buildUserSelectChain(user);
    const updateChain = buildUserUpdateChain(null);
    supabaseFromMock
      .mockImplementationOnce(() => selectChain)
      .mockImplementationOnce(() => updateChain);

    const res = createMockResponse();
    await exerciseController.completeExercise(
      mockReq({
        headers: { authorization: "Bearer token" }
      }),
      res
    );

    expect(res.body).toMatchObject({ success: true, stackExercise: 1 });
    const payload = updateChain.update.mock.calls[0][0];
    expect(payload.stackExercise).toBe(1);
    expect(payload.lastExerciseDate).toBe("2024-05-01");
    jest.useRealTimers();
  });

  test("E1-5 repeat exercise same day increases count instead of new date", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-05-02T00:00:00Z"));
    const user = { stackExercise: 2, lastExerciseDate: "2024-05-02" };
    const selectChain = buildUserSelectChain(user);
    const updateChain = buildUserUpdateChain(null);
    supabaseFromMock
      .mockImplementationOnce(() => selectChain)
      .mockImplementationOnce(() => updateChain);

    const res = createMockResponse();
    await exerciseController.completeExercise(
      mockReq({
        headers: { authorization: "Bearer token" }
      }),
      res
    );

    expect(updateChain.update).toHaveBeenCalled();
    const payload = updateChain.update.mock.calls[0][0];
    expect(payload.stackExercise).toBe(3);
    expect(res.body.stackExercise).toBe(3);
    jest.useRealTimers();
  });
});

describe("Exercise Controller - getExerciseList", () => {
  test("E2-1 Supabase error returns 500", async () => {
    supabaseFromMock.mockImplementationOnce(() =>
      buildSportsListChain(null, { message: "db error" })
    );
    const res = createMockResponse();
    await exerciseController.getExerciseList(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body.message).toBe("Failed to query Supabase database.");
  });

  test("E2-2 returns normalized exercise list", async () => {
    const sports = [
      { id: 1, name: "Run" },
      { id: 2, name: "Swim" }
    ];
    supabaseFromMock.mockImplementationOnce(() => buildSportsListChain(sports));

    const res = createMockResponse();
    await exerciseController.getExerciseList(mockReq(), res);

    expect(res.body.data).toEqual([
      { id: 1, title: "Run" },
      { id: 2, title: "Swim" }
    ]);
  });

  test("E2-3 returns empty array when Supabase data null", async () => {
    supabaseFromMock.mockImplementationOnce(() => buildSportsListChain(null));
    const res = createMockResponse();
    await exerciseController.getExerciseList(mockReq(), res);
    expect(res.body.data).toEqual([]);
  });
});

describe("Exercise Controller - getExercise", () => {
  test("E3-1 missing mood query returns 400", async () => {
    const res = createMockResponse();
    await exerciseController.getExercise(mockReq({ query: {} }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("E3-2 surfaces Supabase errors", async () => {
    const chain = buildSportsQueryChain(null, { message: "db down" });
    supabaseFromMock.mockImplementationOnce(() => chain);
    const res = createMockResponse();
    await exerciseController.getExercise(mockReq({ query: { mood: "sad" } }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("E3-3 returns empty list with message when no matches", async () => {
    const chain = buildSportsQueryChain([], null);
    supabaseFromMock.mockImplementationOnce(() => chain);
    const res = createMockResponse();
    await exerciseController.getExercise(mockReq({ query: { mood: "calm" } }), res);
    expect(res.body.exercise_items).toEqual([]);
    expect(res.body.message).toMatch(/No exercises found/);
  });

  test("E3-4 returns up to 5 mapped exercises for matching mood", async () => {
    const exercises = Array.from({ length: 6 }).map((_, idx) => ({
      id: idx + 1,
      name: `Workout ${idx + 1}`,
      mood_tag: "energetic"
    }));
    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.1);
    const chain = buildSportsQueryChain(exercises, null);
    supabaseFromMock.mockImplementationOnce(() => chain);

    const res = createMockResponse();
    await exerciseController.getExercise(mockReq({ query: { mood: "energetic" } }), res);

    expect(res.body.exercise_items).toHaveLength(5);
    expect(res.body.exercise_items[0]).toHaveProperty("title");
    randomSpy.mockRestore();
  });
});
