import { jest } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";
import { createMockResponse } from "../utils/mockResponse.js";

const sendMailMock = jest.fn();
const createTransportMock = jest.fn(() => ({ sendMail: sendMailMock }));
const supabaseFromMock = jest.fn();
const bcryptHashMock = jest.fn();
const bcryptCompareMock = jest.fn();
const jwtSignMock = jest.fn(() => "signed-token");
const jwtVerifyMock = jest.fn();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const supabaseModulePath = path.resolve(__dirname, "../../config/supabase.js");

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: createTransportMock
  }
}));

jest.unstable_mockModule(supabaseModulePath, () => ({
  supabase: {
    from: supabaseFromMock
  }
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: bcryptHashMock,
    compare: bcryptCompareMock
  }
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jwtSignMock,
    verify: jwtVerifyMock
  }
}));

let authController;
beforeAll(async () => {
  authController = await import("../../controllers/authController.js");
});

const mockReq = ({ body = {}, headers = {}, query = {} } = {}) => ({
  body,
  headers,
  query
});

const buildSelectSingleChain = (data, error = null) => {
  const single = jest.fn().mockResolvedValue({ data, error });
  const eq = jest.fn(() => ({ single }));
  const select = jest.fn(() => ({ eq }));
  return { select, single, eq };
};

const buildSelectResolveChain = (data, error = null) => {
  const eq = jest.fn().mockResolvedValue({ data, error });
  const select = jest.fn(() => ({ eq }));
  return { select, eq };
};

const buildInsertChain = (error = null) => ({
  insert: jest.fn().mockResolvedValue({ error })
});

const buildUpdateChain = (error = null) => {
  const eq = jest.fn().mockResolvedValue({ error });
  const update = jest.fn(() => ({ eq }));
  return { update, eq };
};

const makeSendOtpRequest = email => mockReq({ body: { email } });

const extractOtpFromSend = callIndex => {
  const call = sendMailMock.mock.calls[callIndex]?.[0];
  return call?.text?.match(/\d{6}/)?.[0];
};

const setDefaultSupabaseForLogin = user =>
  supabaseFromMock.mockImplementationOnce(() => buildSelectSingleChain(user));

const setDefaultSupabaseForRegister = (existingUser = null, insertError = null) => {
  supabaseFromMock
    .mockImplementationOnce(() => buildSelectSingleChain(existingUser))
    .mockImplementationOnce(() => buildInsertChain(insertError));
};

beforeEach(() => {
  supabaseFromMock.mockReset();
  sendMailMock.mockReset();
  createTransportMock.mockClear();
  bcryptHashMock.mockReset().mockResolvedValue("hashed-password");
  bcryptCompareMock.mockReset().mockResolvedValue(true);
  jwtSignMock.mockReset().mockReturnValue("signed-token");
  jwtVerifyMock.mockReset().mockReturnValue({ username: "verified-user", email: "verified@cmu.ac.th" });
});

describe("Auth Controller - sendOtp", () => {
  test("A1-1 rejects non-CMU email addresses", async () => {
    const req = makeSendOtpRequest("user@gmail.com");
    const res = createMockResponse();

    await authController.sendOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toMatchObject({
      success: false
    });
    expect(res.body.message).toContain("CMU");
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  test("A1-2 sends OTP via nodemailer for valid CMU email", async () => {
    const req = makeSendOtpRequest("student@cmu.ac.th");
    const res = createMockResponse();
    sendMailMock.mockResolvedValue({});

    await authController.sendOtp(req, res);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0]).toMatchObject({
      to: "student@cmu.ac.th"
    });
    expect(res.body.success).toBe(true);
  });

  test("A1-3 handles transporter errors with 500", async () => {
    sendMailMock.mockRejectedValue(new Error("mailer down"));
    const req = makeSendOtpRequest("student2@cmu.ac.th");
    const res = createMockResponse();

    await authController.sendOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body.success).toBe(false);
  });

  test("A1-4 reuses email storing latest OTP code", async () => {
    sendMailMock.mockResolvedValue({});
    const mathSpy = jest.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    const email = "dup@cmu.ac.th";
    await authController.sendOtp(makeSendOtpRequest(email), createMockResponse());
    const firstOtp = extractOtpFromSend(0);

    await authController.sendOtp(makeSendOtpRequest(email), createMockResponse());
    const secondOtp = extractOtpFromSend(1);

    const resOld = createMockResponse();
    await authController.verifyOtp(mockReq({ body: { email, otp: firstOtp } }), resOld);
    expect(resOld.status).toHaveBeenCalledWith(400);

    const resNew = createMockResponse();
    await authController.verifyOtp(mockReq({ body: { email, otp: secondOtp } }), resNew);
    expect(resNew.body.success).toBe(true);

    mathSpy.mockRestore();
  });
});

describe("Auth Controller - verifyOtp", () => {
  test("A2-1 rejects when OTP not requested", async () => {
    const res = createMockResponse();
    await authController.verifyOtp(mockReq({ body: { email: "unknown@cmu.ac.th", otp: "000000" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body.success).toBe(false);
  });

  test("A2-2 rejects incorrect OTP codes", async () => {
    sendMailMock.mockResolvedValue({});
    await authController.sendOtp(makeSendOtpRequest("otp@cmu.ac.th"), createMockResponse());
    const res = createMockResponse();

    await authController.verifyOtp(mockReq({ body: { email: "otp@cmu.ac.th", otp: "999999" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body.success).toBe(false);
  });

  test("A2-3 rejects expired OTPs", async () => {
    sendMailMock.mockResolvedValue({});
    const timeSpy = jest.spyOn(Date, "now").mockReturnValueOnce(0).mockReturnValueOnce(10 * 60 * 1000);

    await authController.sendOtp(makeSendOtpRequest("expire@cmu.ac.th"), createMockResponse());
    const otp = extractOtpFromSend(0);

    const res = createMockResponse();
    await authController.verifyOtp(mockReq({ body: { email: "expire@cmu.ac.th", otp } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body.success).toBe(false);
    timeSpy.mockRestore();
  });

  test("A2-4 accepts correct, unexpired OTP", async () => {
    sendMailMock.mockResolvedValue({});
    await authController.sendOtp(makeSendOtpRequest("pass@cmu.ac.th"), createMockResponse());
    const otp = extractOtpFromSend(0);
    const res = createMockResponse();

    await authController.verifyOtp(mockReq({ body: { email: "pass@cmu.ac.th", otp } }), res);

    expect(res.body.success).toBe(true);
  });
});

describe("Auth Controller - register", () => {
  test("A3-1 rejects when required fields like password missing", async () => {
    sendMailMock.mockResolvedValue({});
    await authController.sendOtp(makeSendOtpRequest("regmissing@cmu.ac.th"), createMockResponse());
    const otp = extractOtpFromSend(0);

    setDefaultSupabaseForRegister(null, null);
    const res = createMockResponse();

    await authController.register(
      mockReq({
        body: {
          username: "regmissing",
          password: undefined,
          name: "Reg Missing",
          major: "CS",
          otp
        }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("A3-2 rejects when Supabase reports duplicate username", async () => {
    sendMailMock.mockResolvedValue({});
    await authController.sendOtp(makeSendOtpRequest("dupuser@cmu.ac.th"), createMockResponse());
    const otp = extractOtpFromSend(0);

    supabaseFromMock
      .mockImplementationOnce(() => buildSelectSingleChain(null))
      .mockImplementationOnce(() =>
        buildInsertChain({
          message: "duplicate key value violates unique constraint \"User_username_key\""
        })
      );

    const res = createMockResponse();
    await authController.register(
      mockReq({
        body: {
          username: "duplicate",
          password: "Passw0rd!",
          name: "Dup User",
          major: "Science",
          otp
        }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("A3-3 rejects duplicate CMU email addresses", async () => {
    sendMailMock.mockResolvedValue({});
    await authController.sendOtp(makeSendOtpRequest("dupemail@cmu.ac.th"), createMockResponse());
    const otp = extractOtpFromSend(0);

    setDefaultSupabaseForRegister({ id: 1, cmumail: "dupemail@cmu.ac.th" }, null);
    const res = createMockResponse();

    await authController.register(
      mockReq({
        body: {
          username: "dupEmail",
          password: "Password1",
          name: "Dup Email",
          major: "Engineering",
          otp
        }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.body.success).toBe(false);
  });

  test("A3-4 registers new user successfully", async () => {
    sendMailMock.mockResolvedValue({});
    await authController.sendOtp(makeSendOtpRequest("success@cmu.ac.th"), createMockResponse());
    const otp = extractOtpFromSend(0);

    setDefaultSupabaseForRegister(null, null);
    const res = createMockResponse();

    await authController.register(
      mockReq({
        body: {
          username: "successUser",
          password: "Password1",
          name: "Success Case",
          major: "Engineering",
          otp
        }
      }),
      res
    );

    expect(res.body.success).toBe(true);
  });
});

describe("Auth Controller - login and profile", () => {
  test("A4-1 login with unknown username returns 401", async () => {
    setDefaultSupabaseForLogin(null);
    const res = createMockResponse();

    await authController.login(
      mockReq({
        body: { username: "ghost", password: "irrelevant" }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("A4-2 login with wrong password returns 401", async () => {
    setDefaultSupabaseForLogin({ username: "user", password: "hashed" });
    bcryptCompareMock.mockResolvedValue(false);
    const res = createMockResponse();

    await authController.login(
      mockReq({
        body: { username: "user", password: "wrong" }
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("A4-3 login success returns token with username", async () => {
    setDefaultSupabaseForLogin({ username: "valid", password: "hashed" });
    const res = createMockResponse();

    await authController.login(
      mockReq({
        body: { username: "valid", password: "correct" }
      }),
      res
    );

    expect(res.body).toMatchObject({
      token: "signed-token",
      username: "valid"
    });
  });

  test("A4-4 getMe returns profile when token valid", async () => {
    jwtVerifyMock.mockReturnValue({ username: "profileUser" });
    supabaseFromMock.mockImplementationOnce(() => buildSelectSingleChain({ username: "profileUser" }, null));
    const res = createMockResponse();

    await authController.getMe(
      mockReq({
        headers: { authorization: "Bearer abc" }
      }),
      res
    );

    expect(res.body).toMatchObject({
      success: true,
      data: { username: "profileUser" }
    });
  });

  test("A4-5 getMe without Authorization header returns 401", async () => {
    const res = createMockResponse();
    await authController.getMe(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("A4-6 getMoodFood returns username, stack and mood from Supabase", async () => {
    jwtVerifyMock.mockReturnValue({ username: "stackUser" });
    supabaseFromMock.mockImplementationOnce(() =>
      buildSelectSingleChain(
        {
          username: "stackUser",
          stackFood: ["item1"],
          mood: "happy"
        },
        null
      )
    );
    const res = createMockResponse();

    await authController.getMoodFood(
      mockReq({
        headers: { authorization: "Bearer token" }
      }),
      res
    );

    expect(res.body).toMatchObject({
      success: true,
      data: {
        username: "stackUser",
        stack: ["item1"],
        mood: "happy"
      }
    });
  });
});
