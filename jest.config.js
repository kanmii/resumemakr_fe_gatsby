module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/__tests__/test_utils.tsx",
    "<rootDir>/src/refresh-to-app.ts",
    "<rootDir>/src/State/get-conn-status.ts",
    "<rootDir>/src/logger.ts"
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js"
  },
  testRegex: "src/__tests__/.+?\\.test\\.([tj]sx?)$",
  moduleNameMapper: {
    "^styled-components": "<rootDir>/node_modules/styled-components",
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file-mock.js"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: [
    "node_modules",
    ".cache",
    "^.+\\.module\\.(css|sass|scss)$"
  ],
  transformIgnorePatterns: ["node_modules/(?!(gatsby)/)"],
  globals: {
    __PATH_PREFIX__: "",
    "ts-jest": {
      tsConfig: "./tsconfig-base.json"
    }
  },
  testURL: "http://localhost",
  setupFiles: ["<rootDir>/loadershim.js"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  watchPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/cypress"]
};
