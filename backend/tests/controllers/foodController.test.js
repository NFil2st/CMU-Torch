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

let foodController;
beforeAll(async () => {
  foodController = await import("../../controllers/foodController.js");
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

const buildFoodSelectChain = (data, error = null) => {
  const eq = jest.fn().mockResolvedValue({ data, error });
  const select = jest.fn(() => ({ eq }));
  return { select, eq };
};

const buildFoodListChain = (data, error = null) => {
  const or = jest.fn().mockResolvedValue({ data, error });
  const eq = jest.fn(() => ({ or }));
  const select = jest.fn(() => ({ eq }));
  return { select, eq, or };
};

beforeEach(() => {
  supabaseFromMock.mockReset();
  jwtVerifyMock.mockReset().mockReturnValue({ username: "food-user" });
});

describe("Food Controller - completeFood", () => {
  test("F1-1 missing Authorization header returns 401", async () => {
    const res = createMockResponse();
    await foodController.completeFood(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("F1-2 invalid JWT produces 401", async () => {
    jwtVerifyMock.mockImplementation(() => {
      throw new Error("invalid");
    });
    const res = createMockResponse();
    await foodController.completeFood(
      mockReq({ headers: { authorization: "Bearer bad" }, body: {} }),
      res
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("F1-3 responds 404 when Supabase has no user", async () => {
    supabaseFromMock.mockImplementationOnce(() =>
      buildUserSelectChain(null, { message: "error" })
    );
    const res = createMockResponse();
    await foodController.completeFood(
      mockReq({
        headers: { authorization: "Bearer token" }
      }),
      res
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("F1-4 first completion of day creates new stack entry", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-04-04T00:00:00Z"));
    const user = { stackFood: undefined, lastFoodDate: "2024-04-03" };
    const selectChain = buildUserSelectChain(user);
    const updateChain = buildUserUpdateChain(null);
    supabaseFromMock
      .mockImplementationOnce(() => selectChain)
      .mockImplementationOnce(() => updateChain);
    const res = createMockResponse();

    await foodController.completeFood(
      mockReq({
        headers: { authorization: "Bearer token" }
      }),
      res
    );

    expect(res.body).toMatchObject({ success: true, stackFood: 1 });
    const updatePayload = updateChain.update.mock.calls[0][0];
    expect(updatePayload.stackFood).toBe(1);
    expect(updatePayload.lastFoodDate).toBe("2024-04-04");
    jest.useRealTimers();
  });
});

describe("Food Controller - getFood", () => {
  test("F2-1 missing mood query results in 400", async () => {
    const res = createMockResponse();
    await foodController.getFood(mockReq({ query: {} }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("F2-2 surfaces Supabase errors", async () => {
    const chain = buildFoodSelectChain(null, { message: "db down" });
    supabaseFromMock.mockImplementationOnce(() => chain);
    const res = createMockResponse();

    await foodController.getFood(mockReq({ query: { mood: "happy" } }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("F2-3 returns foods filtered by mood tag", async () => {
    const foods = [
      { id: 1, name: "Salad", mood_tag: "happy", goal_tag: "ทั่วไป" }
    ];
    const chain = buildFoodSelectChain(foods);
    supabaseFromMock.mockImplementationOnce(() => chain);
    const res = createMockResponse();

    await foodController.getFood(mockReq({ query: { mood: "happy" } }), res);

    expect(chain.eq).toHaveBeenCalledWith("mood_tag", "happy");
    expect(res.body).toMatchObject({ success: true, food_items: foods });
  });
});

describe("Food Controller - getFoodList mapping", () => {
  test("F3-1 maps goal increase to เพิ่มน้ำหนัก tag", async () => {
    const chain = buildFoodListChain([]);
    supabaseFromMock.mockImplementationOnce(() => chain);
    await foodController.getFoodList(
      mockReq({ query: { mood: "sad", goal: "increase" } }),
      createMockResponse()
    );
    expect(chain.eq).toHaveBeenCalledWith("mood_tag", "sad");
    expect(chain.or.mock.calls[0][0]).toContain("เพิ่มน้ำหนัก");
  });

  test("F3-2 maps goal decrease to ลดน้ำหนัก tag", async () => {
    const chain = buildFoodListChain([]);
    supabaseFromMock.mockImplementationOnce(() => chain);
    await foodController.getFoodList(
      mockReq({ query: { mood: "happy", goal: "decrease" } }),
      createMockResponse()
    );
    expect(chain.or.mock.calls[0][0]).toContain("ลดน้ำหนัก");
  });

  test("F3-3 defaults unknown goal to ทั่วไป tag", async () => {
    const chain = buildFoodListChain([]);
    supabaseFromMock.mockImplementationOnce(() => chain);
    const res = createMockResponse();
    await foodController.getFoodList(
      mockReq({ query: { mood: "calm", goal: "maintain" } }),
      res
    );
    expect(chain.or.mock.calls[0][0]).toContain("ทั่วไป");
    expect(res.body.success).toBe(true);
  });
});
