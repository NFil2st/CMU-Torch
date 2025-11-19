import { jest } from "@jest/globals";
import { createMockResponse } from "../utils/mockResponse.js";

const axiosPostMock = jest.fn();
const readFileSyncMock = jest.fn();
const unlinkSyncMock = jest.fn();

jest.unstable_mockModule("axios", () => ({
  default: {
    post: axiosPostMock
  }
}));

jest.unstable_mockModule("fs", () => ({
  default: {
    readFileSync: readFileSyncMock,
    unlinkSync: unlinkSyncMock
  }
}));

let scanController;
beforeAll(async () => {
  scanController = await import("../../controllers/scanController.js");
});

const mockReq = ({ file } = {}) => ({
  file
});

beforeEach(() => {
  axiosPostMock.mockReset();
  readFileSyncMock.mockReset();
  unlinkSyncMock.mockReset();
});

describe("Scan Controller - scanFood", () => {
  test("S1 returns 500 when file missing under current logic", async () => {
    const res = createMockResponse();
    await scanController.scanFood(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("S2 surfaces Roboflow API errors", async () => {
    readFileSyncMock.mockReturnValue("base64data");
    axiosPostMock.mockRejectedValue({ response: { data: { message: "RF error" } } });
    const res = createMockResponse();

    await scanController.scanFood(
      mockReq({ file: { path: "/tmp/food.jpg" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body.message).toBe("Scan failed");
  });

  test("S3 returns predicted class names when scan succeeds", async () => {
    readFileSyncMock.mockReturnValue("base64data");
    axiosPostMock.mockResolvedValue({
      data: {
        outputs: [
          {
            predictions: [
              { class: "rice" },
              { class: "salad" }
            ]
          }
        ]
      }
    });
    const res = createMockResponse();

    await scanController.scanFood(
      mockReq({ file: { path: "/tmp/pic.jpg" } }),
      res
    );

    expect(res.body).toEqual({ success: true, predictions: ["rice", "salad"] });
  });

  test("S4 deletes temporary file after successful scan", async () => {
    readFileSyncMock.mockReturnValue("data");
    axiosPostMock.mockResolvedValue({
      data: { outputs: [{ predictions: [] }] }
    });
    const res = createMockResponse();
    await scanController.scanFood(mockReq({ file: { path: "/tmp/to-delete.jpg" } }), res);
    expect(unlinkSyncMock).toHaveBeenCalledWith("/tmp/to-delete.jpg");
  });

  test("S5 handles fs.readFileSync errors with 500", async () => {
    readFileSyncMock.mockImplementation(() => {
      throw new Error("fs broken");
    });
    const res = createMockResponse();

    await scanController.scanFood(
      mockReq({ file: { path: "/tmp/error.jpg" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(unlinkSyncMock).not.toHaveBeenCalled();
  });
});
