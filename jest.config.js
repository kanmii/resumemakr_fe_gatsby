module.exports = {
  testEnvironment: "jest-environment-jsdom-fourteen",
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "src/**/*.ts*",
    "!src/components/**/index.ts",
    "!src/**/*injectables.ts",
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
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.jsx?$": "<rootDir>/config/jest/gatsby-preprocess.js",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/fileTransform.js"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(gatsby)/)",
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$"
  ],
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
  globals: {
    __PATH_PREFIX__: ""
  },
  testURL: "http://localhost",
  setupFiles: ["<rootDir>/loadershim.js", "react-app-polyfill/jsdom"],
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.js"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules*",
    "<rootDir>/cypress/",
    "<rootDir>/package.json",
    "<rootDir>/gatsby-*",
    "<rootDir>/src/pages/",
    "<rootDir>/\\.cache/",
    "<rootDir>/public/",
    "<rootDir>/src/graphql/.+?types",
    "<rootDir>/jest\\.config\\.js",
    "<rootDir>/coverage/"
  ],
  extraGlobals: ["Date"],
  roots: ["<rootDir>/src"]
};
