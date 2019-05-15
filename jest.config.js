module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "src/**/*.ts*",
    "!src/components/**/index.ts",
    "!src/components/AuthRequired/**",
    "!src/components/Layout/**",
    "!src/components/root-helmet.tsx",
    "!src/components/**/*hoc.ts*",
    "!src/components/SignUp/scroll-to-top",
    "!src/State/**",
    "!src/graphql/**",
    "!src/__tests__/test_utils.tsx",
    "!src/utils/**",
    "!src/pages/**",
    "!src/**/*.d.ts"
  ],

  coverageReporters: ["json", "lcov", "text", "clover"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js"
  },
  testRegex: "src/__tests__/.+?\\.test\\.([tj]sx?)$",
  moduleNameMapper: {
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
      isolatedModules: true
    }
  },
  testURL: "http://localhost",
  setupFiles: ["<rootDir>/loadershim.js"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/cypress",
    "<rootDir>/src/pages/"
  ]
};
