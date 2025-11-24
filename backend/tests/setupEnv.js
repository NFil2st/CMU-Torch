import { jest } from "@jest/globals";

process.env.JWT_SECRET = "test-secret";
process.env.EMAIL_USER = "tester@cmu.ac.th";
process.env.EMAIL_PASS = "test-password";
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_KEY = "test-key";

beforeEach(() => {
  jest.clearAllMocks();
});
