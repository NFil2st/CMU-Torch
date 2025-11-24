module.exports = {
  testEnvironment: "node",
  transform: {},
  collectCoverageFrom: [
    "controllers/**/*.js",
    "!controllers/**/*.{test,spec}.js"
  ],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupEnv.js"],
  verbose: true
};
